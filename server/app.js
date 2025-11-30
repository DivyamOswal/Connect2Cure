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

/**
 * ✅ VERY PERMISSIVE CORS
 * This will allow ANY origin (including all connect2-cure*.vercel.app)
 * and send Access-Control-Allow-Origin: <request-origin>
 *
 * You can tighten this later if needed.
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow all origins, including undefined (like Postman)
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(morgan("dev"));

/**
 * ⚠️ Stripe Webhook route with RAW body
 * This MUST come BEFORE express.json() so Stripe signature verification works.
 * In Stripe dashboard, set endpoint as:
 *   https://connect2cure-backend.onrender.com/api/billing/webhook
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
