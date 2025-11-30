// client/src/pages/ChatAndVideoCall/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../../socket"; // ✅ default import now
import ChatSidebar from "../../components/ChatAndVideo/ChatSidebar";
import ChatWindow from "../../components/ChatAndVideo/ChatWindow";

const ChatPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // connect sockets and listen for new messages
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // 🔥 no connectSocket() call needed anymore

    const handleIncoming = (msg) => {
      if (!selectedUser || !selectedUser._id || !msg) return;

      const isRelevant =
        String(msg.sender) === selectedUser._id ||
        String(msg.receiver) === selectedUser._id;

      if (!isRelevant) return;

      setMessages((prev) => {
        if (msg._id && prev.some((m) => m._id === msg._id)) {
          return prev;
        }
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

  // load contact list (threads)
  useEffect(() => {
    if (!token) return;

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

    const fetchThreads = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/threads`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setThreads(data);

        if (data.length > 0 && !selectedUser) {
          handleSelectUser(data[0].user);
        }
      } catch (err) {
        console.error("Failed to load threads", err);
      }
    };

    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    try {
      const res = await fetch(
        `${API_BASE_URL}/messages/conversation/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load conversation", err);
    }
  };

  const handleSendMessage = async ({ text, file }) => {
    if (!selectedUser) return;

    let attachment = null;

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE_URL}/messages/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // don't set Content-Type with FormData
          },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Upload failed:", data.message);
        } else {
          attachment = data.attachment; // { url, filename, ... }
        }
      }

      socket.emit("send-message", {
        receiverId: selectedUser._id,
        text,
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
    <div className="h-160 flex bg-gray-100">
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
