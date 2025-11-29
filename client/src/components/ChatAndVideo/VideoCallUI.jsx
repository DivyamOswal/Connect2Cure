import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

const VideoCallUI = ({ otherUserId, onEnd }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null);

  useEffect(() => {
    startCall();
  }, []);

  const startCall = async () => {
    pcRef.current = new RTCPeerConnection();

    // Local video
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    stream.getTracks().forEach((t) =>
      pcRef.current.addTrack(t, stream)
    );

    localVideoRef.current.srcObject = stream;

    // Remote video
    pcRef.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    // ICE Candidate
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: otherUserId,
          candidate: e.candidate,
        });
      }
    };

    // CREATE OFFER
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socket.emit("call-offer", {
      to: otherUserId,
      offer,
    });
  };

  // When receiving answer
  useEffect(() => {
    socket.on("call-answer", async ({ answer }) => {
      await pcRef.current.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pcRef.current.addIceCandidate(candidate);
      } catch {}
    });

    return () => {
      socket.off("call-answer");
      socket.off("ice-candidate");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <video ref={localVideoRef} autoPlay muted className="w-1/3 rounded-lg" />
      <video ref={remoteVideoRef} autoPlay className="w-1/3 rounded-lg mt-4" />

      <button
        onClick={onEnd}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg"
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCallUI;
