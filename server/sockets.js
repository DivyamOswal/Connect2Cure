import jwt from "jsonwebtoken";
import Message from "./models/Message.js";

const onlineUsers = new Map(); // userId → socketId

export default function registerSockets(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("authenticate", (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        socket.user = { id: decoded.userId };

        onlineUsers.set(decoded.userId, socket.id);
        console.log("🟢 Socket authenticated:", decoded.userId);
      } catch (err) {
        console.error("❌ Socket auth failed");
        socket.disconnect();
      }
    });

    // ============================
    // SEND MESSAGE (text + file)
    // ============================
    socket.on("send-message", async ({ receiverId, text, attachment }) => {
      try {
        if (!socket.user || !receiverId) return;

        // Save permanently in MongoDB
        const saved = await Message.create({
          sender: socket.user.id,
          receiver: receiverId,
          text: text || "",
          attachment: attachment || null,
        });

        // SEND TO SENDER
        socket.emit("message-sent", saved);

        // SEND TO RECEIVER IF ONLINE
        const recSocket = onlineUsers.get(receiverId);
        if (recSocket) {
          io.to(recSocket).emit("receive-message", saved);
        }
      } catch (err) {
        console.error("💥 send-message error:", err);
      }
    });

    socket.on("disconnect", () => {
      if (socket.user) {
        onlineUsers.delete(socket.user.id);
      }
    });
  });
}
