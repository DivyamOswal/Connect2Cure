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
    if (!token) return navigate("/login");
    socket.emit("authenticate", token);
  }, [token]);

  // ================= CALL EVENTS =================
  useEffect(() => {
    const handleIncoming = ({ callerId }) => {
      console.log("📞 Incoming:", callerId);
      setIncomingCall({ callerId });
    };

    const handleAccepted = () => {
      console.log("✅ Call accepted");

      navigate(`/video-call/${selectedUser._id}`, {
        state: { isCaller: true },
      });
    };

    socket.on("incoming-call-notify", handleIncoming);
    socket.on("call-accepted", handleAccepted);

    socket.on("call-rejected", () => alert("Call rejected"));
    socket.on("call-ended", () => alert("Call ended"));

    return () => {
      socket.off("incoming-call-notify", handleIncoming);
      socket.off("call-accepted", handleAccepted);
      socket.off("call-rejected");
      socket.off("call-ended");
    };
  }, [selectedUser]);

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

  // ================= SELECT USER =================
  const handleSelectUser = async (user) => {
    if (!user?._id) return;

    setSelectedUser(user);

    const res = await fetch(
      `${API_BASE_URL}/messages/conversation/${user._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  };

  // ================= SOCKET MESSAGES =================
  useEffect(() => {
    const handler = (msg) => {
      if (!msg) return;

      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
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
    if (!id) return;

    console.log("📤 Call init:", id);

    socket.emit("call-user-init", {
      receiverId: id,
    });
  };

  // ================= ACCEPT =================
  const handleAccept = () => {
    socket.emit("accept-call", {
      callerId: incomingCall.callerId,
    });

    navigate(`/video-call/${incomingCall.callerId}`, {
      state: { isReceiver: true },
    });

    setIncomingCall(null);
  };

  // ================= REJECT =================
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
        onSelect={handleSelectUser}
      />

      <ChatWindow
        user={selectedUser}
        messages={messages}
        onSend={handleSendMessage}
        onCall={handleStartCall}
      />

      {incomingCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded text-center">
            <h2>Incoming Call</h2>

            <div className="flex gap-4 mt-4">
              <button onClick={handleAccept} className="bg-green-500 px-4 py-2 text-white">
                Accept
              </button>
              <button onClick={handleReject} className="bg-red-500 px-4 py-2 text-white">
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