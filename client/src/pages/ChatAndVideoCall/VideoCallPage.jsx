import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../socket";

const VideoCallPage = () => {
  const { otherUserId } = useParams();
  const navigate = useNavigate();

  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const iceQueue = useRef([]);

  // CREATE PEER
  const createPeer = async () => {
    if (pcRef.current) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current = pc;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;
    localRef.current.srcObject = stream;

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    pc.ontrack = (e) => {
      if (!remoteRef.current.srcObject) {
        remoteRef.current.srcObject = new MediaStream();
      }

      e.streams[0].getTracks().forEach((track) => {
        remoteRef.current.srcObject.addTrack(track);
      });
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: otherUserId,
          candidate: e.candidate,
        });
      }
    };
  };

  useEffect(() => {
    createPeer();

    socket.on("incoming-call", handleIncoming);
    socket.on("call-answer", handleAnswer);
    socket.on("ice-candidate", handleICE);
    socket.on("call-ended", handleEnd);

    return () => {
      socket.off("incoming-call");
      socket.off("call-answer");
      socket.off("ice-candidate");
      socket.off("call-ended");
      cleanup();
    };
  }, []);

  // CALLER → CREATE OFFER
  useEffect(() => {
    const startCall = async () => {
      if (!pcRef.current) await createPeer();

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socket.emit("call-user", {
        receiverId: otherUserId,
        offer,
      });
    };

    startCall();
  }, []);

  // RECEIVER
  const handleIncoming = async ({ offer }) => {
    if (!pcRef.current) await createPeer();

    await pcRef.current.setRemoteDescription(offer);

    iceQueue.current.forEach((c) => pcRef.current.addIceCandidate(c));
    iceQueue.current = [];

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("call-answer", {
      callerId: otherUserId,
      answer,
    });
  };

  // ANSWER
  const handleAnswer = async ({ answer }) => {
    await pcRef.current.setRemoteDescription(answer);

    iceQueue.current.forEach((c) => pcRef.current.addIceCandidate(c));
    iceQueue.current = [];
  };

  // ICE
  const handleICE = async ({ candidate }) => {
    if (pcRef.current.remoteDescription) {
      await pcRef.current.addIceCandidate(candidate);
    } else {
      iceQueue.current.push(candidate);
    }
  };

  // END
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
      <video ref={localRef} autoPlay muted className="w-64 border" />
      <video ref={remoteRef} autoPlay className="w-64 mt-4 border" />

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