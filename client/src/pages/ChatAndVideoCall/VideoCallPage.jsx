import React, { useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import socket from "../../socket";

const VideoCallPage = () => {
  const { otherUserId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const isCaller = state?.isCaller;
  const isReceiver = state?.isReceiver;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);

  // ================= CREATE PEER =================
  const createPeer = async () => {
    if (pcRef.current) return; // 🔥 prevent duplicate

    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;
    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      pcRef.current.addTrack(track, stream);
    });

    pcRef.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: otherUserId,
          candidate: e.candidate,
        });
      }
    };
  };

  // ================= INIT =================
  useEffect(() => {
    createPeer();

    socket.on("call-accepted", handleAccepted);
    socket.on("incoming-call", handleIncoming);
    socket.on("call-answer", handleAnswer);
    socket.on("ice-candidate", handleICE);
    socket.on("call-ended", handleEnd);

    return () => {
      socket.off("call-accepted", handleAccepted);
      socket.off("incoming-call", handleIncoming);
      socket.off("call-answer", handleAnswer);
      socket.off("ice-candidate", handleICE);
      socket.off("call-ended", handleEnd);
      cleanup();
    };
  }, []);

  // ================= CALLER =================
  const handleAccepted = async () => {
    if (!isCaller) return;
    if (!pcRef.current || pcRef.current.signalingState === "closed") return;

    console.log("📤 Creating OFFER");

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socket.emit("call-user", {
      receiverId: otherUserId,
      offer,
    });
  };

  // ================= RECEIVER =================
  const handleIncoming = async ({ offer }) => {
    if (!isReceiver) return;

    console.log("📥 Received OFFER");

    if (!pcRef.current) await createPeer();

    await pcRef.current.setRemoteDescription(offer);

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("call-answer", {
      callerId: otherUserId,
      answer,
    });
  };

  // ================= ANSWER =================
  const handleAnswer = async ({ answer }) => {
    if (!pcRef.current) return;

    console.log("📥 Received ANSWER");

    await pcRef.current.setRemoteDescription(answer);
  };

  // ================= ICE =================
  const handleICE = async ({ candidate }) => {
    try {
      if (pcRef.current) {
        await pcRef.current.addIceCandidate(candidate);
      }
    } catch {}
  };

  // ================= END =================
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

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <video ref={localVideoRef} autoPlay muted className="w-64" />
      <video ref={remoteVideoRef} autoPlay className="w-64 mt-4" />

      <button
        onClick={() => {
          socket.emit("end-call", { receiverId: otherUserId });
          cleanup();
          navigate(-1);
        }}
        className="mt-6 bg-red-600 text-white px-6 py-2"
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCallPage;