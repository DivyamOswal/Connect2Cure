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

  // ================= AUTH =================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    socket.emit("authenticate", token);
  }, [token, navigate]);

  // ================= CALL EVENTS =================
  useEffect(() => {
    // 📞 Incoming call
    const handleIncoming = ({ callerId }) => {
      console.log("📞 Incoming:", callerId);
      setIncomingCall({ callerId });
    };

    // ✅ Call accepted (caller side)
    const handleAccepted = ({ receiverId }) => {
      console.log("✅ Call accepted");

      // 🔥 FIXED: use receiverId from backend
      navigate(`/video-call/${receiverId}`);
    };

    // ❌ Rejected
    const handleRejected = () => {
      alert("Call rejected");
    };

    // 🔴 Ended
    const handleEnded = () => {
      alert("Call ended");
    };

    socket.on("incoming-call-notify", handleIncoming);
    socket.on("call-accepted", handleAccepted);
    socket.on("call-rejected", handleRejected);
    socket.on("call-ended", handleEnded);

    return () => {
      socket.off("incoming-call-notify", handleIncoming);
      socket.off("call-accepted", handleAccepted);
      socket.off("call-rejected", handleRejected);
      socket.off("call-ended", handleEnded);
    };
  }, [navigate]);

  // ================= LOAD THREADS =================
  useEffect(() => {
    if (!token) return;

    const loadThreads = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/threads`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

    loadThreads();
  }, [token]);

  // ================= SELECT USER =================
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

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Conversation error:", err);
      setMessages([]);
    }
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

  // ================= SEND MESSAGE =================
  const handleSendMessage = ({ text }) => {
    if (!selectedUser || !text?.trim()) return;

    socket.emit("send-message", {
      receiverId: selectedUser._id,
      text: text.trim(),
    });
  };

  // ================= START CALL =================
  const handleStartCall = (id) => {
    if (!id) return;

    console.log("📤 Call init:", id);

    socket.emit("call-user-init", {
      receiverId: id,
    });
  };

  // ================= ACCEPT CALL =================
  const handleAccept = () => {
    socket.emit("accept-call", {
      callerId: incomingCall.callerId,
    });

    // 🔥 FIXED: navigate with correct callerId
    navigate(`/video-call/${incomingCall.callerId}`);

    setIncomingCall(null);
  };

  // ================= REJECT CALL =================
  const handleReject = () => {
    socket.emit("reject-call", {
      callerId: incomingCall.callerId,
    });

    setIncomingCall(null);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <ChatSidebar
        threads={threads}
        selected={selectedUser}
        onSelect={handleSelectUser}
      />

      {/* Chat Window */}
      <ChatWindow
        user={selectedUser}
        messages={messages}
        onSend={handleSendMessage}
        onCall={handleStartCall}
      />

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <h2 className="text-lg font-semibold">Incoming Call</h2>

            <div className="flex gap-4 mt-4 justify-center">
              <button
                onClick={handleAccept}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Accept
              </button>

              <button
                onClick={handleReject}
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