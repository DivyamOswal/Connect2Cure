import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../socket";

const VideoCallPage = () => {
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  const [isCaller, setIsCaller] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    init();

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-answer", handleCallAnswered);
    socket.on("ice-candidate", handleRemoteIce);
    socket.on("call-ended", handleCallEnded);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-answer", handleCallAnswered);
      socket.off("ice-candidate", handleRemoteIce);
      socket.off("call-ended", handleCallEnded);
      cleanup();
    };
  }, [otherUserId]);

  // =========================
  // INIT WEBRTC
  // =========================
  const init = async () => {
    try {
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

      pcRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            to: otherUserId,
            candidate: e.candidate,
          });
        }
      };

      pcRef.current.ontrack = (e) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) =>
        pcRef.current.addTrack(track, stream)
      );

      // caller starts offer
      startCall();
    } catch (err) {
      console.error("Init error:", err);
      navigate(-1);
    }
  };

  // =========================
  // CALL START
  // =========================
  const startCall = async () => {
    try {
      setIsCaller(true);

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socket.emit("call-user", {
        receiverId: otherUserId,
        offer,
      });
    } catch (err) {
      console.error("startCall error", err);
    }
  };

  // =========================
  // RECEIVER SIDE
  // =========================
  const handleIncomingCall = async ({ callerId, offer }) => {
    if (callerId !== otherUserId) return;

    setIsCaller(false);

    try {
      await pcRef.current.setRemoteDescription(offer);

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("call-answer", {
        callerId,
        answer,
      });
    } catch (err) {
      console.error("Incoming call error:", err);
    }
  };

  // =========================
  // ANSWER RECEIVED
  // =========================
  const handleCallAnswered = async ({ answer }) => {
    try {
      await pcRef.current?.setRemoteDescription(answer);
    } catch (err) {
      console.error("Answer error:", err);
    }
  };

  // =========================
  // ICE HANDLING
  // =========================
  const handleRemoteIce = async ({ candidate }) => {
    try {
      await pcRef.current?.addIceCandidate(candidate);
    } catch (err) {
      console.error("ICE error:", err);
    }
  };

  // =========================
  // CALL END
  // =========================
  const handleCallEnded = () => {
    alert("Call ended");
    cleanup();
    navigate(-1);
  };

  const cleanup = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((t) => t.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleEndClick = () => {
    socket.emit("end-call", { receiverId: otherUserId });
    cleanup();
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="w-64 h-48 bg-gray-800 rounded"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-64 h-48 bg-gray-800 rounded"
        />
      </div>

      <button
        onClick={handleEndClick}
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg"
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCallPage;