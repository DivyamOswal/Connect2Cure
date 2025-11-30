// server/server.js
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import registerSockets from "./sockets.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const socketAllowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "https://connect2-cure-dedu.vercel.app",
].filter(Boolean);

export const io = new Server(server, {
  cors: {
    origin: socketAllowedOrigins,
    credentials: true,
  },
});

registerSockets(io);

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
