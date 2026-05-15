import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import registerSockets from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

//  CORS origin checker 
const allowOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);

  const allowed =
    origin === "https://connect2-cure.vercel.app" ||
    origin === "http://localhost:5173" ||
    origin === "http://localhost:3000" ||
    /^https:\/\/connect2-cure.*\.vercel\.app$/.test(origin) ||
    /^https:\/\/.*\.divyamoswals-projects\.vercel\.app$/.test(origin);

  if (allowed) {
    callback(null, true);
  } else {
    console.warn("❌ Socket CORS blocked:", origin);
    callback(new Error("Socket CORS: not allowed"));
  }
};

//  Socket.IO 
const io = new Server(server, {
  cors: {
    origin: allowOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

//  Register all socket events from socket.js 
registerSockets(io);

//  Start server 
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});