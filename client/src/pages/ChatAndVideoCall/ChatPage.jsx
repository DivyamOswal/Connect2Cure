// client/src/pages/ChatAndVideoCall/ChatPage.jsx
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
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // Redirect if not authenticated & authenticate socket
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // (re-)authenticate socket with current token
    socket.emit("authenticate", token);
  }, [token, navigate]);

  // Load threads on mount
  useEffect(() => {
    if (!token) return;

    const loadThreads = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/threads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setThreads(data || []);

        // auto-select first contact if none selected
        if (data && data.length > 0 && !selectedUser) {
          handleSelectUser(data[0].user);
        }
      } catch (err) {
        console.error("Failed to load threads", err);
      }
    };

    loadThreads();
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

  // Socket incoming messages
  useEffect(() => {
    if (!selectedUser) return;

    const handleIncoming = (msg) => {
      if (!msg) return;

      // sender / receiver can be ObjectId or populated doc
      const senderId = msg.sender?._id || msg.sender;
      const receiverId = msg.receiver?._id || msg.receiver;

      const selId = String(selectedUser._id);
      const isRelevant =
        (senderId && String(senderId) === selId) ||
        (receiverId && String(receiverId) === selId);

      if (!isRelevant) return;

      setMessages((prev) => {
        // try to replace optimistic temp message
        const tempIndex = prev.findIndex(
          (m) =>
            m.pending &&
            m.text === msg.text &&
            String(m.receiver) === String(receiverId) &&
            String(m.sender) === String(senderId)
        );

        if (tempIndex !== -1) {
          const clone = [...prev];
          clone[tempIndex] = msg;
          return clone;
        }

        // avoid duplicates
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

  // Send a new message (with optional file)
  const handleSendMessage = async ({ text, file }) => {
    if (!selectedUser || (!text?.trim() && !file)) return;

    let attachment = null;

    try {
      // 1) Upload file if provided
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(`${API_BASE_URL}/messages/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          console.error("Upload failed:", uploadData.message);
        } else {
          attachment = uploadData.attachment; // { url, filename, originalName, mimeType, size }
        }
      }

      const cleanText = text?.trim() || "";

      // 2) Optimistic temp message
      const tempMsg = {
        _id: `temp-${Date.now()}`,
        text: cleanText,
        attachment,
        sender: currentUser?._id || currentUser?.id,
        receiver: selectedUser._id,
        createdAt: new Date().toISOString(),
        pending: true,
      };

      setMessages((prev) => [...prev, tempMsg]);

      // 3) Emit via socket (server will save & broadcast)
      socket.emit("send-message", {
        receiverId: selectedUser._id,
        text: cleanText,
        attachment,
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

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
