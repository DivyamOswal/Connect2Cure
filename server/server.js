// server/index.js
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import Message from "./models/Message.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// store online users
const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // =========================
  // AUTHENTICATE USER
  // =========================
  socket.on("authenticate", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      socket.user = {
        id: decoded.userId,
      };

      onlineUsers.set(decoded.userId, socket.id);

      console.log("🟢 Authenticated:", decoded.userId);

      socket.emit("authenticated");
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
      if (!socket.user) return;

      const message = await Message.create({
        sender: socket.user.id,
        receiver: receiverId,
        text: text || "",
        attachment: attachment || null,
      });

      // send back to sender
      socket.emit("message-sent", message);

      // send to receiver if online
      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-message", message);
      }
    } catch (err) {
      console.error("💥 send-message error:", err);
    }
  });

  // =========================
  // TYPING INDICATOR
  // =========================
  socket.on("typing", ({ receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", {
        userId: socket.user.id,
      });
    }
  });

  socket.on("stop-typing", ({ receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("stop-typing", {
        userId: socket.user.id,
      });
    }
  });

  // =========================
  // VIDEO CALL SIGNALING
  // =========================
  socket.on("call-user", ({ receiverId, signalData, roomId }) => {
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("incoming-call", {
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
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("call-ended");
    }
  });

  // =========================
  // DISCONNECT
  // =========================
  socket.on("disconnect", () => {
    if (socket.user) {
      onlineUsers.delete(socket.user.id);
    }

    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// debug route
app.get("/cors-debug", (req, res) => {
  res.json({
    ok: true,
    origin: req.headers.origin || null,
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});