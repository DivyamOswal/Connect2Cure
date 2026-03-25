import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import socket from "../../socket";

const VideoCallPage = () => {
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isCaller = location.state?.isCaller ?? false;

  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const iceQueue = useRef([]);

  const [callStatus, setCallStatus] = useState(isCaller ? "Calling…" : "Connecting…");
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  // ─── BUILD PEER ─────────────────────────────────────────────────────────────
  const buildPeer = async () => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    pcRef.current = pc;

    // Get local stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;
    if (localRef.current) localRef.current.srcObject = stream;
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    // Set up remote stream
    const remoteStream = new MediaStream();
    if (remoteRef.current) remoteRef.current.srcObject = remoteStream;

    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      setCallStatus("Connected ✓");
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { to: otherUserId, candidate: e.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        handleEnd();
      }
    };

    return pc;
  };

  // ─── INIT ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Register ALL listeners BEFORE any async work so we never miss events
    socket.on("incoming-call", handleIncomingOffer);
    socket.on("call-answer", handleAnswer);
    socket.on("ice-candidate", handleICE);
    socket.on("call-ended", handleEnd);

    const init = async () => {
      const pc = await buildPeer();
      if (!mounted) return;

      if (isCaller) {
        // Only the caller creates and sends the offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("call-user", { receiverId: otherUserId, offer });
      }
      // Receiver just waits for the "incoming-call" event
    };

    init();

    return () => {
      mounted = false;
      socket.off("incoming-call", handleIncomingOffer);
      socket.off("call-answer", handleAnswer);
      socket.off("ice-candidate", handleICE);
      socket.off("call-ended", handleEnd);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── RECEIVER: HANDLE OFFER ─────────────────────────────────────────────────
  const handleIncomingOffer = async ({ offer }) => {
    const pc = pcRef.current || (await buildPeer());

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    // Drain any ICE candidates that arrived before remote description was set
    for (const c of iceQueue.current) await pc.addIceCandidate(c);
    iceQueue.current = [];

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("call-answer", { callerId: otherUserId, answer });
    setCallStatus("Connected ✓");
  };

  // ─── CALLER: HANDLE ANSWER ──────────────────────────────────────────────────
  const handleAnswer = async ({ answer }) => {
    const pc = pcRef.current;
    if (!pc) return;

    await pc.setRemoteDescription(new RTCSessionDescription(answer));

    // Drain any queued ICE candidates
    for (const c of iceQueue.current) await pc.addIceCandidate(c);
    iceQueue.current = [];
  };

  // ─── ICE CANDIDATE ──────────────────────────────────────────────────────────
  const handleICE = async ({ candidate }) => {
    const pc = pcRef.current;
    if (!pc) return;

    if (pc.remoteDescription) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      // Queue it — remote description not ready yet
      iceQueue.current.push(candidate);
    }
  };

  // ─── END CALL ───────────────────────────────────────────────────────────────
  const handleEnd = () => {
    cleanup();
    navigate(-1);
  };

  const cleanup = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // ─── CONTROLS ───────────────────────────────────────────────────────────────
  const toggleMute = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((v) => !v);
  };

  const toggleCam = () => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsCamOff((v) => !v);
  };

  // ─── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center gap-4">
      <p className="text-white text-sm tracking-wide opacity-70">{callStatus}</p>

      <div className="relative w-full max-w-2xl px-4">
        {/* Remote video (large) */}
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="w-full rounded-2xl bg-black aspect-video object-cover"
        />

        {/* Local video (picture-in-picture) */}
        <video
          ref={localRef}
          autoPlay
          muted
          playsInline
          className="absolute bottom-3 right-7 w-32 rounded-xl border-2 border-white bg-black aspect-video object-cover shadow-lg"
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={toggleMute}
          className={`px-5 py-2 rounded-full text-white font-medium transition ${
            isMuted
              ? "bg-yellow-600 hover:bg-yellow-500"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button
          onClick={toggleCam}
          className={`px-5 py-2 rounded-full text-white font-medium transition ${
            isCamOff
              ? "bg-yellow-600 hover:bg-yellow-500"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {isCamOff ? "Cam On" : "Cam Off"}
        </button>

        <button
          onClick={() => {
            socket.emit("end-call", { receiverId: otherUserId });
            cleanup();
            navigate(-1);
          }}
          className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium transition"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCallPage;