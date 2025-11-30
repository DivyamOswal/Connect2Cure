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
import { handleStripeWebhook } from "./controllers/billingController.js";

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

// ✅ CORS setup
// Explicitly allowed origins
const baseAllowedOrigins = [
  "http://localhost:5173",

  // main deployed frontends
  "https://connect2-cure.vercel.app",
  "https://connect2-cure-dedu.vercel.app",

  // any extra domains you might set via env
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

// Allow ALL Vercel preview URLs that start with "connect2-cure"
//
// Examples this will match:
//  - https://connect2-cure.vercel.app
//  - https://connect2-cure-j7zrwblts-divyamoswals-projects.vercel.app
//  - https://connect2-cure-something-else.vercel.app
//
const connect2CureRegex = /^https:\/\/connect2-cure.*\.vercel\.app$/;

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Postman / curl / server-to-server

  if (baseAllowedOrigins.includes(origin)) return true;

  if (connect2CureRegex.test(origin)) return true;

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

/**
 * ⚠️ Stripe Webhook route with RAW body
 * This MUST come BEFORE express.json() so Stripe signature verification works.
 * In Stripe dashboard, set endpoint as: https://connect2cure-backend.onrender.com/api/billing/webhook
 */
app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// After webhook is defined, parse JSON for all other routes
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

// ✅ Serve /uploads/* from server/uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
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
