import React, { useEffect, useRef } from "react";
import { socket } from "../socket";

const VideoCallUI = ({ otherUserId, onEnd }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null);

  useEffect(() => {
    startCall();

    return () => cleanup(); // 🔥 important
  }, []);

  const startCall = async () => {
    try {
      // ✅ STUN added (important)
      pcRef.current = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
});

      // 🎥 Get media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;

      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });

      // 🎥 Remote stream
      pcRef.current.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
      };

      // 🌐 ICE
      pcRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            to: otherUserId,
            candidate: e.candidate,
          });
        }
      };

      // 📞 CREATE OFFER
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socket.emit("call-user", {
        receiverId: otherUserId,
        offer,
      });
    } catch (err) {
      console.error("Call start error:", err);
    }
  };

  // =========================
  // SOCKET LISTENERS
  // =========================
  useEffect(() => {
    const handleAnswer = async ({ answer }) => {
      try {
        await pcRef.current?.setRemoteDescription(answer);
      } catch (err) {
        console.error("Answer error:", err);
      }
    };

    const handleICE = async ({ candidate }) => {
      try {
        await pcRef.current?.addIceCandidate(candidate);
      } catch {}
    };

    const handleEnd = () => {
      cleanup();
    };

    socket.on("call-answer", handleAnswer);
    socket.on("ice-candidate", handleICE);
    socket.on("call-ended", handleEnd);

    return () => {
      socket.off("call-answer", handleAnswer);
      socket.off("ice-candidate", handleICE);
      socket.off("call-ended", handleEnd);
    };
  }, []);

  // =========================
  // CLEANUP (VERY IMPORTANT)
  // =========================
  const cleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;

    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((t) => t.stop());
    }

    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject = null;
    }

    onEnd && onEnd();
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className="w-1/3 rounded-lg"
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        className="w-1/3 rounded-lg mt-4"
      />

      <button
        onClick={() => {
          socket.emit("end-call", { receiverId: otherUserId });
          cleanup();
        }}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg"
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCallUI;