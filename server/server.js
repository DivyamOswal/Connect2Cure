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
    origin: "*", // change in production
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// store online users
const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // =========================
  // AUTH
  // =========================
  socket.on("authenticate", (token) => {
    try {
      if (!token) return socket.disconnect();

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      socket.user = { id: String(decoded.userId) };

      onlineUsers.set(socket.user.id, socket.id);

      console.log("🟢 Authenticated:", socket.user.id);
      console.log("🟢 Online users:", Array.from(onlineUsers.keys()));

      socket.emit("authenticated");
      io.emit("online-users", Array.from(onlineUsers.keys()));

    } catch (err) {
      console.error("❌ Auth failed:", err.message);
      socket.disconnect();
    }
  });

  // =========================
  // CHAT
  // =========================
  socket.on("send-message", async ({ receiverId, text, attachment }) => {
    try {
      if (!socket.user || !receiverId) return;

      const message = await Message.create({
        sender: socket.user.id,
        receiver: receiverId,
        text: text || "",
        attachment: attachment || null,
      });

      socket.emit("message-sent", message);

      const recSocket = onlineUsers.get(String(receiverId));

      if (recSocket) {
        io.to(recSocket).emit("receive-message", message);
      } else {
        console.log("❌ Receiver offline:", receiverId);
      }

    } catch (err) {
      console.error("💥 send-message error:", err);
    }
  });

  // =========================
  // TYPING
  // =========================
  socket.on("typing", ({ receiverId }) => {
    const recSocket = onlineUsers.get(String(receiverId));
    if (recSocket) {
      io.to(recSocket).emit("typing", { userId: socket.user.id });
    }
  });

  socket.on("stop-typing", ({ receiverId }) => {
    const recSocket = onlineUsers.get(String(receiverId));
    if (recSocket) {
      io.to(recSocket).emit("stop-typing", { userId: socket.user.id });
    }
  });

  // =========================
  // 🎥 VIDEO CALL (FINAL FLOW)
  // =========================

  // 1️⃣ CALL INIT → show popup
  socket.on("call-user-init", ({ receiverId }) => {
    console.log("📥 CALL INIT:", receiverId);

    const recSocket = onlineUsers.get(String(receiverId));

    console.log("🎯 Receiver socket:", recSocket);

    if (recSocket) {
      io.to(recSocket).emit("incoming-call-notify", {
        callerId: socket.user.id,
      });
    } else {
      console.log("❌ Receiver not online");
    }
  });

  // 2️⃣ ACCEPT CALL
  socket.on("accept-call", ({ callerId }) => {
    console.log("✅ Call accepted");

    const callerSocket = onlineUsers.get(String(callerId));

    if (callerSocket) {
      io.to(callerSocket).emit("call-accepted");
    }
  });

  // 3️⃣ SEND OFFER
  socket.on("call-user", ({ receiverId, offer }) => {
    console.log("📤 Sending OFFER");

    const recSocket = onlineUsers.get(String(receiverId));

    if (recSocket) {
      io.to(recSocket).emit("incoming-call", {
        callerId: socket.user.id,
        offer,
      });
    }
  });

  // 4️⃣ ANSWER
  socket.on("call-answer", ({ callerId, answer }) => {
    console.log("📥 Answer received");

    const callerSocket = onlineUsers.get(String(callerId));

    if (callerSocket) {
      io.to(callerSocket).emit("call-answer", { answer });
    }
  });

  // 5️⃣ ICE
  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocket = onlineUsers.get(String(to));

    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { candidate });
    }
  });

  // 6️⃣ REJECT
  socket.on("reject-call", ({ callerId }) => {
    console.log("❌ Call rejected");

    const callerSocket = onlineUsers.get(String(callerId));

    if (callerSocket) {
      io.to(callerSocket).emit("call-rejected");
    }
  });

  // 7️⃣ END CALL
  socket.on("end-call", ({ receiverId }) => {
    console.log("🔴 Call ended");

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
      onlineUsers.delete(socket.user.id);
    }

    console.log("🔌 Disconnected:", socket.id);
    console.log("🟢 Online users:", Array.from(onlineUsers.keys()));

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

// =========================
// DEBUG ROUTE
// =========================
app.get("/cors-debug", (req, res) => {
  res.json({
    ok: true,
    origin: req.headers.origin || null,
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});