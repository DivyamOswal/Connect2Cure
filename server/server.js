// server/server.js
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import registerSockets from "./sockets.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN
],

    credentials: true,
  },
});

registerSockets(io);

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
