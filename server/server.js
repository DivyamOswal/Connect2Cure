import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import Message from "./models/Message.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ Connected:", socket.id);

  // ================= AUTH =================
  socket.on("authenticate", (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.user = { id: String(decoded.userId) };

      onlineUsers.set(socket.user.id, socket.id);

      socket.emit("authenticated");
      io.emit("online-users", Array.from(onlineUsers.keys()));
    } catch (err) {
      socket.disconnect();
    }
  });

  // ================= CHAT =================
  socket.on("send-message", async ({ receiverId, text }) => {
    if (!socket.user) return;

    const message = await Message.create({
      sender: socket.user.id,
      receiver: receiverId,
      text,
    });

    socket.emit("message-sent", message);

    const rec = onlineUsers.get(String(receiverId));
    if (rec) io.to(rec).emit("receive-message", message);
  });

  // ================= VIDEO CALL =================

  // 1️⃣ INIT CALL
  socket.on("call-user-init", ({ receiverId }) => {
    const rec = onlineUsers.get(String(receiverId));
    if (rec) {
      io.to(rec).emit("incoming-call-notify", {
        callerId: socket.user.id,
      });
    }
  });

  // 2️⃣ ACCEPT CALL
  socket.on("accept-call", ({ callerId }) => {
    const callerSocket = onlineUsers.get(String(callerId));

    if (callerSocket) {
      io.to(callerSocket).emit("call-accepted", {
        receiverId: socket.user.id, // 🔥 FIX
      });
    }
  });

  // 3️⃣ SEND OFFER
  socket.on("call-user", ({ receiverId, offer }) => {
    const rec = onlineUsers.get(String(receiverId));

    if (rec) {
      io.to(rec).emit("incoming-call", {
        callerId: socket.user.id,
        offer,
      });
    }
  });

  // 4️⃣ ANSWER
  socket.on("call-answer", ({ callerId, answer }) => {
    const callerSocket = onlineUsers.get(String(callerId));

    if (callerSocket) {
      io.to(callerSocket).emit("call-answer", { answer });
    }
  });

  // 5️⃣ ICE
  socket.on("ice-candidate", ({ to, candidate }) => {
    const target = onlineUsers.get(String(to));
    if (target) {
      io.to(target).emit("ice-candidate", { candidate });
    }
  });

  // 6️⃣ END
  socket.on("end-call", ({ receiverId }) => {
    const rec = onlineUsers.get(String(receiverId));
    if (rec) io.to(rec).emit("call-ended");
  });

  socket.on("disconnect", () => {
    if (socket.user?.id) onlineUsers.delete(socket.user.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

server.listen(PORT, () => {
  console.log("🚀 Server running");
});