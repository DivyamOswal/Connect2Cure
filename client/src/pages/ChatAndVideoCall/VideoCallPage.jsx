import React, { useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import socket from "../../socket";

const VideoCallPage = () => {
  const { otherUserId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const incomingOffer = location.state?.offer;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  useEffect(() => {
    init();

    socket.on("call-answer", handleAnswer);
    socket.on("ice-candidate", handleICE);
    socket.on("call-ended", handleEnd);

    return () => {
      socket.off("call-answer", handleAnswer);
      socket.off("ice-candidate", handleICE);
      socket.off("call-ended", handleEnd);
      cleanup();
    };
  }, []);

  const init = async () => {
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

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((t) =>
      pcRef.current.addTrack(t, stream)
    );

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

    // 🔥 CALL FLOW
    if (incomingOffer) {
      await pcRef.current.setRemoteDescription(incomingOffer);

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("call-answer", {
        callerId: otherUserId,
        answer,
      });
    } else {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socket.emit("call-user", {
        receiverId: otherUserId,
        offer,
      });
    }
  };

  const handleAnswer = async ({ answer }) => {
    await pcRef.current?.setRemoteDescription(answer);
  };

  const handleICE = async ({ candidate }) => {
    try {
      await pcRef.current?.addIceCandidate(candidate);
    } catch {}
  };

  const handleEnd = () => {
    cleanup();
    navigate(-1);
  };

  const cleanup = () => {
    pcRef.current?.close();

    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((t) => t.stop());
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