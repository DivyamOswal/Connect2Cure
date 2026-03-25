import jwt from "jsonwebtoken";
import Message from "./models/Message.js";

const onlineUsers = new Map(); // userId -> socketId

export default function registerSockets(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // =========================
    // AUTHENTICATE USER
    // =========================
    socket.on("authenticate", (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        socket.user = { id: decoded.userId };

        onlineUsers.set(String(decoded.userId), socket.id);

        console.log("🟢 Authenticated:", decoded.userId);

        socket.emit("authenticated");

        io.emit("online-users", Array.from(onlineUsers.keys()));
      } catch (err) {
        console.error("❌ Auth failed");
        socket.disconnect();
      }
    });

    // =========================
    // SEND MESSAGE (CHAT)
    // =========================
    socket.on("send-message", async ({ receiverId, text, attachment }) => {
      try {
        if (!socket.user || !receiverId) return;

        const saved = await Message.create({
          sender: socket.user.id,
          receiver: receiverId,
          text: text || "",
          attachment: attachment || null,
        });

        // sender confirm
        socket.emit("message-sent", saved);

        // receiver deliver
        const recSocket = onlineUsers.get(String(receiverId));

        if (recSocket) {
          io.to(recSocket).emit("receive-message", saved);
        }
      } catch (err) {
        console.error("💥 send-message error:", err);
      }
    });

    // =========================
    // MESSAGE READ
    // =========================
    socket.on("read-message", async ({ messageId, senderId }) => {
      try {
        if (!messageId) return;

        await Message.findByIdAndUpdate(messageId, {
          isRead: true,
        });

        const senderSocket = onlineUsers.get(String(senderId));

        if (senderSocket) {
          io.to(senderSocket).emit("message-read", messageId);
        }
      } catch (err) {
        console.error("read-message error:", err);
      }
    });

    // =========================
    // TYPING
    // =========================
    socket.on("typing", ({ receiverId }) => {
      const recSocket = onlineUsers.get(String(receiverId));

      if (recSocket) {
        io.to(recSocket).emit("typing", {
          userId: socket.user?.id,
        });
      }
    });

    socket.on("stop-typing", ({ receiverId }) => {
      const recSocket = onlineUsers.get(String(receiverId));

      if (recSocket) {
        io.to(recSocket).emit("stop-typing", {
          userId: socket.user?.id,
        });
      }
    });

    // =========================
    // 🎥 VIDEO CALL (WEBRTC)
    // =========================

    // CALL INITIATE (OFFER)
    socket.on("call-user", ({ receiverId, offer }) => {
      if (!socket.user || !receiverId || !offer) return;

      const recSocket = onlineUsers.get(String(receiverId));

      if (recSocket) {
        io.to(recSocket).emit("incoming-call", {
          callerId: socket.user.id,
          offer,
        });
      }
    });

    // CALL ANSWER
    socket.on("call-answer", ({ callerId, answer }) => {
      const callerSocket = onlineUsers.get(String(callerId));

      if (callerSocket) {
        io.to(callerSocket).emit("call-answer", { answer });
      }
    });

    // ICE CANDIDATE (VERY IMPORTANT)
    socket.on("ice-candidate", ({ to, candidate }) => {
      const targetSocket = onlineUsers.get(String(to));

      if (targetSocket) {
        io.to(targetSocket).emit("ice-candidate", {
          candidate,
        });
      }
    });

    // CALL REJECT
    socket.on("reject-call", ({ callerId }) => {
      const callerSocket = onlineUsers.get(String(callerId));

      if (callerSocket) {
        io.to(callerSocket).emit("call-rejected");
      }
    });

    // CALL END
    socket.on("end-call", ({ receiverId }) => {
      const recSocket = onlineUsers.get(String(receiverId));

      if (recSocket) {
        io.to(recSocket).emit("call-ended");
      }
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      if (socket.user?.id) {
        onlineUsers.delete(String(socket.user.id));
      }

      io.emit("online-users", Array.from(onlineUsers.keys()));

      console.log("🔌 Socket disconnected:", socket.id);
    });
  });
}