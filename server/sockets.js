import jwt from "jsonwebtoken";
import Message from "./models/Message.js";

const onlineUsers = new Map(); // userId -> socketId

export default function registerSockets(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // =========================
    // AUTH
    // =========================
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
        console.error("❌ Auth failed");
        socket.disconnect();
      }
    });

    // =========================
    // CHAT
    // =========================
    socket.on("send-message", async ({ receiverId, text, attachment }) => {
      try {
        if (!socket.user || !receiverId) {
          console.log("❌ Invalid message data");
          return;
        }

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

    // =========================
    // VIDEO CALL (FIXED)
    // =========================

    // 1️⃣ CALL INIT
    socket.on("call-user-init", ({ receiverId }) => {
      console.log("📥 CALL INIT:", receiverId);

      if (!socket.user || !receiverId) {
        console.log("❌ Invalid call init");
        return;
      }

      const recSocket = onlineUsers.get(String(receiverId));

      // 🔥 ADD THESE TWO LINES
      console.log("🎯 Receiver socket:", recSocket);
      console.log("🟢 Online users:", Array.from(onlineUsers.keys()));

      if (recSocket) {
        io.to(recSocket).emit("incoming-call-notify", {
          callerId: socket.user.id,
        });
      } else {
        console.log("❌ Receiver NOT ONLINE or ID mismatch");
      }
    });

    // 2️⃣ ACCEPT
    socket.on("accept-call", ({ callerId }) => {
      console.log("✅ CALL ACCEPTED by:", socket.user?.id);

      const callerSocket = onlineUsers.get(String(callerId));

      if (callerSocket) {
        io.to(callerSocket).emit("call-accepted");
      } else {
        console.log("❌ Caller not found");
      }
    });

    // 3️⃣ OFFER
    socket.on("call-user", ({ receiverId, offer }) => {
      console.log("📤 Sending OFFER to:", receiverId);

      const recSocket = onlineUsers.get(String(receiverId));

      if (recSocket) {
        io.to(recSocket).emit("incoming-call", {
          callerId: socket.user.id,
          offer,
        });
      } else {
        console.log("❌ OFFER FAILED - receiver not found");
      }
    });

    // 4️⃣ ANSWER
    socket.on("call-answer", ({ callerId, answer }) => {
      console.log("📥 ANSWER received");

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
}
