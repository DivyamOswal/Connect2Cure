import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket, connectSocket } from "../../socket";

const VideoCallPage = () => {
  const { otherUserId } = useParams(); // /video-call/:otherUserId
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const [isCaller, setIsCaller] = useState(true); // when we navigate here, we start the call

  // 1. Setup socket + WebRTC on mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    connectSocket(token);

    // Prepare RTCPeerConnection
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          receiverId: otherUserId,
          candidate: event.candidate,
        });
      }
    };

    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // get local media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) =>
          pcRef.current.addTrack(track, stream)
        );

        // as caller: create offer
        startCallAsCaller();
      })
      .catch((err) => {
        console.error("getUserMedia error", err);
        alert("Could not access camera/microphone");
        navigate(-1);
      });

    // socket events
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-answered", handleCallAnswered);
    socket.on("ice-candidate", handleRemoteIce);
    socket.on("call-ended", handleCallEnded);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-answered", handleCallAnswered);
      socket.off("ice-candidate", handleRemoteIce);
      socket.off("call-ended", handleCallEnded);

      endCall();
    };
  }, [otherUserId, token, navigate]);

  const startCallAsCaller = async () => {
    try {
      setIsCaller(true);
      const pc = pcRef.current;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call-user", {
        receiverId: otherUserId,
        offer,
      });
    } catch (err) {
      console.error("startCallAsCaller error", err);
    }
  };

  // When we are the callee (if you ever want to support answering from a link)
  const handleIncomingCall = async ({ callerId, offer }) => {
    if (callerId !== otherUserId) return;
    setIsCaller(false);

    const pc = pcRef.current;
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer-call", {
      callerId,
      answer,
    });
  };

  const handleCallAnswered = async ({ answer }) => {
    const pc = pcRef.current;
    await pc.setRemoteDescription(answer);
  };

  const handleRemoteIce = async (candidate) => {
    try {
      await pcRef.current.addIceCandidate(candidate);
    } catch (err) {
      console.error("Error adding remote ICE candidate", err);
    }
  };

  const handleCallEnded = () => {
    alert("Call ended by other user");
    endCall();
    navigate(-1);
  };

  const endCall = () => {
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((s) => s.track && s.track.stop());
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      remoteVideoRef.current.srcObject = null;
    }
    socket.emit("end-call", { otherUserId });
  };

  const handleEndClick = () => {
    endCall();
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
