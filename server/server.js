// server/index.js
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

/**
 * 🔌 Socket.IO with VERY PERMISSIVE CORS
 * Allows ANY Origin to connect (including all connect2-cure*.vercel.app)
 */
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // allow any origin
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Your existing socket logic
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // Example handlers (replace with your own)
  // socket.on("join-room", (roomId) => {
  //   socket.join(roomId);
  // });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// Export io if needed elsewhere
export { io };

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
