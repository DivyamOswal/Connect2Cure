// src/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { connectSocket, socket } from "../../socket";
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

    connectSocket();

    const handleIncoming = (msg) => {
      if (
        !selectedUser ||
        !selectedUser._id ||
        !msg
      )
        return;

      const isRelevant =
        String(msg.sender) === selectedUser._id ||
        String(msg.receiver) === selectedUser._id;

      if (!isRelevant) return;

      setMessages((prev) => {
        // avoid duplicates by _id
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

    const fetchThreads = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages/threads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setThreads(data);

        // optional: auto-select first thread
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

  // load conversation from DB whenever you pick a user
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/conversation/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMessages(data); // these come from MongoDB
    } catch (err) {
      console.error("Failed to load conversation", err);
    }
  };

  // send message via socket (text + optional file; server will emit events)
  const handleSendMessage = async ({ text, file }) => {
    if (!selectedUser) return;

    let attachment = null;

    try {
      // 1) If there is a file, upload it first
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          "http://localhost:5000/api/messages/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              // don't set Content-Type manually with FormData
            },
            body: formData,
          }
        );

        const data = await res.json();
        if (!res.ok) {
          console.error("Upload failed:", data.message);
        } else {
          attachment = data.attachment; // { url, filename, originalName, mimeType, size }
        }
      }

      // 2) Emit via Socket.IO
      socket.emit("send-message", {
        receiverId: selectedUser._id,
        text,
        attachment,
      });

      // ❌ No optimistic push here – we'll rely on `message-sent` / `receive-message`
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
