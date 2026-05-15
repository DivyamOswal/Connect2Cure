import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import app from "./app.js";
import Message from "./models/Message.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

//  Same CORS logic as app.js 
const allowOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);

  const isAllowed =
    origin === "https://connect2-cure.vercel.app" ||
    origin === "http://localhost:5173"            ||
    origin === "http://localhost:3000"            ||
    /^https:\/\/connect2-cure[^.]*\.vercel\.app$/.test(origin) ||
    /^https:\/\/[^.]+\.divyamoswals-projects\.vercel\.app$/.test(origin);

  if (isAllowed) {
    callback(null, true);
  } else {
    console.warn("❌ Socket CORS blocked:", origin);
    callback(new Error("Socket CORS: not allowed"));
  }
};

// Socket.IO 
const io = new Server(server, {
  cors: {
    origin: allowOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // AUTH
  socket.on("authenticate", (token) => {
    try {
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

  // CHAT
  socket.on("send-message", async ({ receiverId, text, attachment }) => {
    try {
      if (!socket.user || !receiverId) return;

      const saved = await Message.create({
        sender: socket.user.id,
        receiver: receiverId,
        text: text || "",
        attachment: attachment || null,
      });

      socket.emit("message-sent", saved);

      const recSocket = onlineUsers.get(String(receiverId));
      if (recSocket) {
        io.to(recSocket).emit("receive-message", saved);
      } else {
        console.log("❌ Receiver not online:", receiverId);
      }
    } catch (err) {
      console.error("💥 send-message error:", err);
    }
  });

  // VIDEO CALL

  // 1️⃣ INIT
  socket.on("call-user-init", ({ receiverId }) => {
    if (!socket.user || !receiverId) return;
    console.log("📥 CALL INIT to:", receiverId);
    console.log("🟢 Online users:", Array.from(onlineUsers.keys()));

    const recSocket = onlineUsers.get(String(receiverId));
    if (recSocket) {
      io.to(recSocket).emit("incoming-call-notify", { callerId: socket.user.id });
    } else {
      console.log("❌ Receiver NOT online:", receiverId);
    }
  });

  // 2️⃣ ACCEPT
  socket.on("accept-call", ({ callerId }) => {
    console.log("✅ CALL ACCEPTED by:", socket.user?.id);
    const callerSocket = onlineUsers.get(String(callerId));
    if (callerSocket) {
      io.to(callerSocket).emit("call-accepted", { receiverId: socket.user.id });
    }
  });

  // 3️⃣ OFFER
  socket.on("call-user", ({ receiverId, offer }) => {
    console.log("📤 Sending OFFER to:", receiverId);
    const recSocket = onlineUsers.get(String(receiverId));
    if (recSocket) {
      io.to(recSocket).emit("incoming-call", { callerId: socket.user.id, offer });
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
    const targetSocket = onlineUsers.get(String(to));
    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { candidate });
    }
  });

  // 6️⃣ REJECT
  socket.on("reject-call", ({ callerId }) => {
    console.log("❌ CALL REJECTED");
    const callerSocket = onlineUsers.get(String(callerId));
    if (callerSocket) {
      io.to(callerSocket).emit("call-rejected");
    }
  });

  // 7️⃣ END
  socket.on("end-call", ({ receiverId }) => {
    console.log("🔴 CALL ENDED");
    const recSocket = onlineUsers.get(String(receiverId));
    if (recSocket) {
      io.to(recSocket).emit("call-ended");
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    if (socket.user?.id) {
      onlineUsers.delete(socket.user.id);
      console.log("🔌 Disconnected:", socket.user.id);
    }
    console.log("🟢 Online users:", Array.from(onlineUsers.keys()));
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

// ─── Start Server 
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});