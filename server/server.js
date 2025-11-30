// server/server.js
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

/**
 * 🔌 Socket.IO with VERY PERMISSIVE CORS
 * - Allows ANY Origin
 */
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // allow any origin (including all connect2-cure*.vercel.app)
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // Example: auth event you mentioned in client
  socket.on("authenticate", (token) => {
    console.log("Socket authenticate token:", token?.slice(0, 10) + "...");
    // TODO: verify token if you want
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// Export io if you need it elsewhere
export { io };

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
