// client/src/pages/ChatAndVideoCall/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../../socket"; // your configured socket.io client
import ChatSidebar from "../../components/ChatAndVideo/ChatSidebar";
import ChatWindow from "../../components/ChatAndVideo/ChatWindow";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ChatPage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // Redirect if not authenticated + attach socket listeners
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const handleIncoming = (msg) => {
      if (!selectedUser || !selectedUser._id || !msg) return;

      // Try to read sender / receiver from different possible shapes
      const senderId =
        msg.sender?._id ||
        msg.senderId ||
        msg.from ||
        msg.sender ||
        null;

      const receiverId =
        msg.receiver?._id ||
        msg.receiverId ||
        msg.to ||
        msg.receiver ||
        null;

      const selId = String(selectedUser._id);

      const isRelevant =
        (senderId && String(senderId) === selId) ||
        (receiverId && String(receiverId) === selId);

      if (!isRelevant) return;

      setMessages((prev) => {
        // avoid duplicates if server echoes the same message
        if (msg._id && prev.some((m) => m._id === msg._id)) {
          return prev;
        }

        // if we had an optimistic temp message, you could match & replace here
        return [...prev, msg];
      });
    };

    socket.on("receive-message", handleIncoming);
    socket.on("message-sent", handleIncoming);

    return () => {
      socket.off("receive-message", handleIncoming);
      socket.off("message-sent", handleIncoming);
    };
  }, [token, selectedUser, navigate]);

  // Load conversation list (threads) on mount
  useEffect(() => {
    if (!token) return;

    const fetchThreads = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/threads`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setThreads(data || []);

        // Auto-select first contact if none selected
        if (data && data.length > 0 && !selectedUser) {
          handleSelectUser(data[0].user);
        }
      } catch (err) {
        console.error("Failed to load threads", err);
      }
    };

    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // When selecting a user in the sidebar, load the conversation
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
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to load conversation", err);
    }
  };

  // Send a new message (with optional file)
  const handleSendMessage = async ({ text, file }) => {
  if (!selectedUser || (!text?.trim() && !file)) return;

  let attachment = null;

  try {
    // 1) Upload file if provided
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/messages/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Upload failed:", data.message);
      } else {
        attachment = data.attachment; // { url, originalName, mimeType, ... }
      }
    }

    // 2) Optimistically add to UI
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      text: text?.trim() || "",
      attachment,
      sender: currentUser?._id || currentUser?.id,
      receiver: selectedUser._id,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, tempMsg]);

    // 3) Emit via socket
    socket.emit("send-message", {
      receiverId: selectedUser._id,
      text: text?.trim() || "",
      attachment,
    });
  } catch (err) {
    console.error("Failed to send message", err);
  }
};


  const handleStartCall = (otherUserId) => {
    if (!otherUserId) return;
    // adjust route if your VideoCall route is different
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
