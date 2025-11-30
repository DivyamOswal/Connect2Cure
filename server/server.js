// server/index.js
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// 🔌 Socket.IO with CORS for ALL connect2-cure Vercel URLs
const socketBaseAllowedOrigins = [
  "http://localhost:5173",
  "https://connect2-cure.vercel.app",
  "https://connect2-cure-dedu.vercel.app",
];

// Same regex as in app.js: allow any preview like
// https://connect2-cure-j7zrwblts-divyamoswals-projects.vercel.app
const connect2CureRegex = /^https:\/\/connect2-cure.*\.vercel\.app$/;

const isSocketAllowedOrigin = (origin) => {
  if (!origin) return true; // mobile apps / native clients without Origin
  if (socketBaseAllowedOrigins.includes(origin)) return true;
  if (connect2CureRegex.test(origin)) return true;
  return false;
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isSocketAllowedOrigin(origin)) {
        return callback(null, true);
      }
      console.log("❌ Socket.IO CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Your existing socket logic
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // Example listeners:
  // socket.on("join-room", (roomId) => {
  //   socket.join(roomId);
  // });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// Export io if you need it in other files (optional)
export { io };

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
