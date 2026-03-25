import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import ChatSidebar from "../../components/ChatAndVideo/ChatSidebar";
import ChatWindow from "../../components/ChatAndVideo/ChatWindow";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ChatPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);

  // AUTH
  useEffect(() => {
    if (!token) return navigate("/login");
    socket.emit("authenticate", token);
  }, [token]);

  // CALL EVENTS
  useEffect(() => {
    socket.on("incoming-call-notify", ({ callerId }) => {
      setIncomingCall({ callerId });
    });

    socket.on("call-accepted", ({ receiverId }) => {
      navigate(`/video-call/${receiverId}`);
    });

    socket.on("call-ended", () => alert("Call ended"));

    return () => {
      socket.off("incoming-call-notify");
      socket.off("call-accepted");
      socket.off("call-ended");
    };
  }, []);

  // START CALL
  const handleStartCall = (id) => {
    socket.emit("call-user-init", { receiverId: id });
  };

  // ACCEPT
  const handleAccept = () => {
    socket.emit("accept-call", {
      callerId: incomingCall.callerId,
    });

    navigate(`/video-call/${incomingCall.callerId}`);
    setIncomingCall(null);
  };

  // REJECT
  const handleReject = () => {
    socket.emit("reject-call", {
      callerId: incomingCall.callerId,
    });
    setIncomingCall(null);
  };

  return (
    <div className="h-screen flex">
      <ChatSidebar
        threads={threads}
        selected={selectedUser}
        onSelect={setSelectedUser}
      />

      <ChatWindow
        user={selectedUser}
        messages={messages}
        onCall={handleStartCall}
      />

      {incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <h2>Incoming Call</h2>

            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleReject}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;