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

        onlineUsers.set(decoded.userId, socket.id);

        console.log("🟢 Socket authenticated:", decoded.userId);

        socket.emit("authenticated");

        // broadcast online users
        io.emit("online-users", Array.from(onlineUsers.keys()));
      } catch (err) {
        console.error("❌ Socket auth failed");
        socket.disconnect();
      }
    });

    // =========================
    // SEND MESSAGE
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

        // sender confirmation
        socket.emit("message-sent", saved);

        // receiver delivery
        const recSocket = onlineUsers.get(receiverId);

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
        await Message.findByIdAndUpdate(messageId, {
          isRead: true,
        });

        const senderSocket = onlineUsers.get(senderId);

        if (senderSocket) {
          io.to(senderSocket).emit("message-read", messageId);
        }
      } catch (err) {
        console.error("read-message error:", err);
      }
    });

    // =========================
    // TYPING INDICATOR
    // =========================
    socket.on("typing", ({ receiverId }) => {
      const recSocket = onlineUsers.get(receiverId);

      if (recSocket) {
        io.to(recSocket).emit("typing", {
          userId: socket.user.id,
        });
      }
    });

    socket.on("stop-typing", ({ receiverId }) => {
      const recSocket = onlineUsers.get(receiverId);

      if (recSocket) {
        io.to(recSocket).emit("stop-typing", {
          userId: socket.user.id,
        });
      }
    });

    // =========================
    // VIDEO CALL SIGNALING
    // =========================

    socket.on("call-user", ({ receiverId, signalData, roomId }) => {
      const recSocket = onlineUsers.get(receiverId);

      if (recSocket) {
        io.to(recSocket).emit("incoming-call", {
          callerId: socket.user.id,
          signal: signalData,
          roomId,
        });
      }
    });

    socket.on("answer-call", ({ callerId, signal }) => {
      const callerSocket = onlineUsers.get(callerId);

      if (callerSocket) {
        io.to(callerSocket).emit("call-answered", signal);
      }
    });

    socket.on("reject-call", ({ callerId }) => {
      const callerSocket = onlineUsers.get(callerId);

      if (callerSocket) {
        io.to(callerSocket).emit("call-rejected");
      }
    });

    socket.on("end-call", ({ receiverId }) => {
      const recSocket = onlineUsers.get(receiverId);

      if (recSocket) {
        io.to(recSocket).emit("call-ended");
      }
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      if (socket.user) {
        onlineUsers.delete(socket.user.id);
      }

      io.emit("online-users", Array.from(onlineUsers.keys()));

      console.log("🔌 Socket disconnected:", socket.id);
    });
  });
}