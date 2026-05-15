// server/app.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
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
import { handleStripeWebhook } from "./controllers/billingController.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── Clean weird %0A in URL 
app.use((req, res, next) => {
  if (typeof req.url === "string") {
    req.url = req.url.replace(/%0A/gi, "");
  }
  next();
});

// CORS (must be FIRST before any routes) 
const allowedOrigins = [
  "https://connect2-cure.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

// Handle ALL preflight OPTIONS requests immediately
app.options("*", cors(corsOptions));

//  Stripe Webhook (RAW body — MUST be before express.json()) 
app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

//  Body parsers 
app.use(express.json());
app.use(cookieParser());

//  Logging 
app.use(morgan("dev"));

//  DB 
connectDB();

//  Static uploads 
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//  API Routes 
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

//  Health check 
app.get("/", (req, res) => {
  res.send("Connect2Cure backend running");
});

//  Global error handler 
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

export default app;