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
  const iceQueue = useRef([]); // 🔥 FIX

  // ================= CREATE PEER =================
  const createPeer = async () => {
    if (pcRef.current) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current = pc;

    // 🎥 LOCAL STREAM
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;
    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // 🎥 REMOTE STREAM (CRITICAL FIX)
    pc.ontrack = (event) => {
      console.log("📺 Remote stream received");

      if (!remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject = new MediaStream();
      }

      event.streams[0].getTracks().forEach((track) => {
        remoteVideoRef.current.srcObject.addTrack(track);
      });
    };

    // 🌐 ICE
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: otherUserId,
          candidate: event.candidate,
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

    await pcRef.current.setRemoteDescription(offer);

    // 🔥 Apply queued ICE
    iceQueue.current.forEach((c) =>
      pcRef.current.addIceCandidate(c)
    );
    iceQueue.current = [];

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("call-answer", {
      callerId: otherUserId,
      answer,
    });
  };

  // ================= ANSWER =================
  const handleAnswer = async ({ answer }) => {
    console.log("📥 Received ANSWER");

    await pcRef.current.setRemoteDescription(answer);

    // 🔥 Apply queued ICE
    iceQueue.current.forEach((c) =>
      pcRef.current.addIceCandidate(c)
    );
    iceQueue.current = [];
  };

  // ================= ICE =================
  const handleICE = async ({ candidate }) => {
    if (!pcRef.current) return;

    if (pcRef.current.remoteDescription) {
      await pcRef.current.addIceCandidate(candidate);
    } else {
      iceQueue.current.push(candidate); // 🔥 FIX
    }
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
      {/* 🔥 LOCAL */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className="w-64 border"
      />

      {/* 🔥 REMOTE */}
      <video
        ref={remoteVideoRef}
        autoPlay
        className="w-64 mt-4 border"
      />

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