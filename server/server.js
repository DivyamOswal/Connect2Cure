// server/server.js
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import registerSockets from "./sockets.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Explicit allowed origins
const baseSocketAllowedOrigins = [
  "http://localhost:5173",
  "https://connect2-cure-dedu.vercel.app",
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

// Regex to match ALL preview deployments like
// https://connect2-cure-dedu-xxxxx.vercel.app
const vercelPreviewRegex =
  /^https:\/\/connect2-cure-dedu-.*\.vercel\.app$/;

export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Non-browser / server-to-server (no Origin header)
      if (!origin) return callback(null, true);

      if (
        baseSocketAllowedOrigins.includes(origin) ||
        vercelPreviewRegex.test(origin)
      ) {
        return callback(null, true);
      }

      console.log("❌ SOCKET.IO CORS blocked origin:", origin);
      return callback(new Error("Not allowed by Socket.IO CORS"), false);
    },
    credentials: true,
  },
});

registerSockets(io);

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
