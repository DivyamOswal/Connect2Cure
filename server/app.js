// server/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
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
import reportRoutes from "./routes/reportRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";

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
  console.log("➡", req.method, JSON.stringify(req.url));
  next();
});

app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup
const baseAllowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "https://connect2-cure-dedu.vercel.app", // main prod
].filter(Boolean);

// matches e.g. https://connect2-cure-dedu-6zpzbtwb0-divyamoswals-projects.vercel.app
const vercelPreviewRegex =
  /^https:\/\/connect2-cure-dedu-.*-divyamoswals-projects\.vercel\.app$/;

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Postman / curl etc.
  if (baseAllowedOrigins.includes(origin)) return true;
  if (vercelPreviewRegex.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      console.log("❌ HTTP CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

app.use(morgan("dev"));

// Connect DB
connectDB();

// ✅ Serve /uploads/* from server/uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/billing", billingRoutes);

app.get("/", (req, res) => {
  res.send("Connect2Cure backend running");
});

export default app;
