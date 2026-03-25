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

  // ================= AUTH =================
  useEffect(() => {
    if (!token) return navigate("/login");
    socket.emit("authenticate", token);
  }, [token]);

  // ================= INCOMING CALL =================
  useEffect(() => {
    const handleIncomingCall = ({ callerId, offer }) => {
      if (!callerId || !offer) return;

      navigate(`/video-call/${callerId}`, {
        state: { offer },
      });
    };

    socket.on("incoming-call", handleIncomingCall);
    return () => socket.off("incoming-call", handleIncomingCall);
  }, []);

  // ================= LOAD THREADS =================
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/messages/threads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setThreads(arr);

        if (arr.length) setSelectedUser(arr[0].user);
      })
      .catch(() => setThreads([]));
  }, [token]);

  // ================= LOAD MESSAGES =================
  const handleSelectUser = async (user) => {
    if (!user?._id) return;

    setSelectedUser(user);

    const res = await fetch(
      `${API_BASE_URL}/messages/conversation/${user._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  };

  // ================= SOCKET MESSAGES =================
  useEffect(() => {
    const handler = (msg) => {
      if (!msg) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("message-sent", handler);
    socket.on("receive-message", handler);

    return () => {
      socket.off("message-sent", handler);
      socket.off("receive-message", handler);
    };
  }, []);

  // ================= SEND =================
  const handleSendMessage = ({ text }) => {
    if (!selectedUser || !text?.trim()) return;

    socket.emit("send-message", {
      receiverId: selectedUser._id,
      text: text.trim(),
    });
  };

  // ================= START CALL =================
  const handleStartCall = (id) => {
    navigate(`/video-call/${id}`);
  };

  return (
    <div className="h-screen flex">
      <ChatSidebar
        threads={threads}
        selected={selectedUser}
        onSelect={handleSelectUser}
      />

      <ChatWindow
        user={selectedUser}
        messages={messages}
        onSend={handleSendMessage}
        onCall={handleStartCall}
      />
    </div>
  );
};

export default ChatPage;