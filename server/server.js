// server/index.js
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

/**
 * 🔌 Socket.IO with permissive CORS
 * origin: true = reflect the request origin
 */
const io = new Server(server, {
  cors: {
    origin: true,           // reflect Origin header
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("authenticate", (token) => {
    console.log("Socket authenticate token:", token?.slice(0, 10) + "...");
    // TODO: verify token if needed
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// (Optional) simple debug route to confirm which process is running
app.get("/cors-debug", (req, res) => {
  res.json({
    ok: true,
    origin: req.headers.origin || null,
    corsHeaders: {
      "Access-Control-Allow-Origin": res.getHeader("Access-Control-Allow-Origin") || null,
      "Access-Control-Allow-Credentials":
        res.getHeader("Access-Control-Allow-Credentials") || null,
    },
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
