// server/sockets.js
import jwt from "jsonwebtoken";
import Message from "./models/Message.js";

const onlineUsers = new Map(); // userId -> socketId

export default function registerSockets(io) {
  io.on("connection", (socket) => {
    console.log("🔌 New connection:", socket.id);

    socket.on("authenticate", (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        socket.user = { id: decoded.userId, role: decoded.role };
        onlineUsers.set(decoded.userId, socket.id);
        console.log("🟢 Authenticated socket for user:", decoded.userId);
      } catch (err) {
        console.error("Socket auth error:", err);
        socket.disconnect();
      }
    });

    // ---------- CHAT: SEND MESSAGE (text + optional attachment) ----------
    socket.on("send-message", async ({ receiverId, text, attachment }) => {
      try {
        if (!socket.user) return;
        if (!receiverId) return;
        if (!text?.trim() && !attachment) return; // avoid empty message

        const msg = await Message.create({
          sender: socket.user.id,
          receiver: receiverId,
          text: text?.trim() || "",
          attachment: attachment || undefined,
        });

        socket.emit("message-sent", msg);

        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive-message", msg);
        }
      } catch (err) {
        console.error("send-message error:", err);
      }
    });

    socket.on("disconnect", () => {
      if (socket.user) {
        onlineUsers.delete(socket.user.id);
        console.log("🔴 Disconnected:", socket.user.id);
      }
    });
  });
}
