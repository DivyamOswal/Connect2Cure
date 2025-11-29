// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appoinmentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import callRoutes from "./routes/callRoutes.js";

import registerSockets from "./sockets.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Clean weird %0A in URL if any
app.use((req, res, next) => {
  if (typeof req.url === "string") {
    req.url = req.url.replace(/%0A/gi, "");
  }
  next();
});

// Log request
app.use((req, res, next) => {
  console.log("➡️", req.method, JSON.stringify(req.url));
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);    // 🆕
app.use("/api/calls", callRoutes);   // 🆕

app.get("/", (req, res) => {
  res.send("Connect2Cure backend running");
});

// ---------- HTTP + SOCKET SERVER ----------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

registerSockets(io);

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
