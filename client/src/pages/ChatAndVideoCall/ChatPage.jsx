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

  // 🔥 NEW STATE
  const [incomingCall, setIncomingCall] = useState(null);

  // ================= AUTH =================
  useEffect(() => {
    if (!token) return navigate("/login");
    socket.emit("authenticate", token);
  }, [token]);

  // ================= INCOMING CALL =================
  useEffect(() => {
    const handleIncomingCall = ({ callerId, offer }) => {
      if (!callerId || !offer) return;

      // 🔥 show popup instead of auto navigation
      setIncomingCall({ callerId, offer });
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

      {/* 🔥 INCOMING CALL MODAL */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <h2 className="text-lg font-semibold">Incoming Call</h2>

            <div className="flex gap-4 mt-4 justify-center">
              <button
                onClick={() => {
                  navigate(`/video-call/${incomingCall.callerId}`, {
                    state: { offer: incomingCall.offer },
                  });
                  setIncomingCall(null);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => {
                  socket.emit("reject-call", {
                    callerId: incomingCall.callerId,
                  });
                  setIncomingCall(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;