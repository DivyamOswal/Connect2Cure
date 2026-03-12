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

  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    currentUser = {};
  }

  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // =============================
  // Select user
  // =============================
  const handleSelectUser = async (user) => {
    if (!user || !user._id) return;

    setSelectedUser(user);

    try {
      const res = await fetch(
        `${API_BASE_URL}/messages/conversation/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      const msgs = Array.isArray(data) ? data : data?.messages || [];

      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load conversation", err);
    }
  };

  // =============================
  // Authentication
  // =============================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    socket.emit("authenticate", token);
  }, [token, navigate]);

  // =============================
  // Load threads
  // =============================
  useEffect(() => {
    if (!token) return;

    const loadThreads = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/threads`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        const threadsArray = Array.isArray(data)
          ? data
          : data?.threads || [];

        setThreads(threadsArray);

        if (threadsArray.length > 0 && !selectedUser) {
          handleSelectUser(threadsArray[0].user);
        }
      } catch (err) {
        console.error("Failed to load threads", err);
      }
    };

    loadThreads();
  }, [token]);

  // =============================
  // Socket messages
  // =============================
  useEffect(() => {
    if (!selectedUser) return;

    const handleIncoming = (msg) => {
      if (!msg) return;

      const senderId = msg.sender?._id || msg.sender;
      const receiverId = msg.receiver?._id || msg.receiver;

      const selId = String(selectedUser._id);

      const isRelevant =
        (senderId && String(senderId) === selId) ||
        (receiverId && String(receiverId) === selId);

      if (!isRelevant) return;

      setMessages((prev) => {
        if (!Array.isArray(prev)) return [msg];

        if (msg._id && prev.some((m) => String(m._id) === String(msg._id))) {
          return prev;
        }

        return [...prev, msg];
      });
    };

    socket.on("message-sent", handleIncoming);
    socket.on("receive-message", handleIncoming);

    return () => {
      socket.off("message-sent", handleIncoming);
      socket.off("receive-message", handleIncoming);
    };
  }, [selectedUser]);

  // =============================
  // Send message
  // =============================
  const handleSendMessage = ({ text }) => {
    if (!selectedUser || !text?.trim()) return;

    socket.emit("send-message", {
      receiverId: selectedUser._id,
      text: text.trim(),
      attachment: null,
    });
  };

  // =============================
  // Start call
  // =============================
  const handleStartCall = (otherUserId) => {
    if (!otherUserId) return;

    navigate(`/video-call/${otherUserId}`);
  };

  return (
    <div className="h-screen flex bg-gray-100">
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