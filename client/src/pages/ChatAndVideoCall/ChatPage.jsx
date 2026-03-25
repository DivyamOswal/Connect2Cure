import React, { useEffect, useState, useRef } from "react";
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

  const isSocketReady = useRef(false);

  // ================= AUTH =================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    socket.emit("authenticate", token);

    socket.on("authenticated", () => {
      console.log("✅ Socket authenticated");
      isSocketReady.current = true;
    });

    return () => {
      socket.off("authenticated");
    };
  }, [token, navigate]);

  // ================= INCOMING CALL =================
  useEffect(() => {
    const handleIncomingCall = ({ callerId, offer }) => {
      console.log("📞 Incoming call:", callerId);

      if (!callerId || !offer) return;

      setIncomingCall({ callerId, offer });
    };

    socket.on("incoming-call", handleIncomingCall);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
    };
  }, []);

  // ================= LOAD THREADS =================
  useEffect(() => {
    if (!token) return;

    const fetchThreads = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/threads`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch threads");

        const data = await res.json();

        const arr = Array.isArray(data) ? data : [];
        setThreads(arr);

        if (arr.length > 0) {
          setSelectedUser(arr[0].user);
        }
      } catch (err) {
        console.error("Threads error:", err);
        setThreads([]);
      }
    };

    fetchThreads();
  }, [token]);

  // ================= LOAD MESSAGES =================
  const handleSelectUser = async (user) => {
    if (!user?._id) return;

    setSelectedUser(user);

    try {
      const res = await fetch(
        `${API_BASE_URL}/messages/conversation/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Conversation fetch failed");

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Conversation error:", err);
      setMessages([]);
    }
  };

  // ================= SOCKET MESSAGES =================
  useEffect(() => {
    const handleMessage = (msg) => {
      if (!msg) return;

      setMessages((prev) => {
        if (!Array.isArray(prev)) return [msg];

        // prevent duplicates
        if (prev.some((m) => m._id === msg._id)) return prev;

        return [...prev, msg];
      });
    };

    socket.on("message-sent", handleMessage);
    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("message-sent", handleMessage);
      socket.off("receive-message", handleMessage);
    };
  }, []);

  // ================= SEND =================
  const handleSendMessage = ({ text }) => {
    if (!selectedUser?._id || !text?.trim()) return;

    socket.emit("send-message", {
      receiverId: selectedUser._id,
      text: text.trim(),
    });
  };

  // ================= START CALL =================
  const handleStartCall = (id) => {
    if (!id || !isSocketReady.current) {
      console.warn("Socket not ready");
      return;
    }

    navigate(`/video-call/${id}`);
  };

  // ================= ACCEPT CALL =================
  const handleAcceptCall = () => {
    if (!incomingCall) return;

    navigate(`/video-call/${incomingCall.callerId}`, {
      state: { offer: incomingCall.offer },
    });

    setIncomingCall(null);
  };

  // ================= REJECT CALL =================
  const handleRejectCall = () => {
    if (!incomingCall) return;

    socket.emit("reject-call", {
      callerId: incomingCall.callerId,
    });

    setIncomingCall(null);
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

      {/* ================= INCOMING CALL MODAL ================= */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold">Incoming Call</h2>
            <p className="text-sm text-gray-500 mt-2">
              Someone is calling you...
            </p>

            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={handleAcceptCall}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Accept
              </button>

              <button
                onClick={handleRejectCall}
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