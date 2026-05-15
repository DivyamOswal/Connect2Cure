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

//  1. Clean %0A in URLs 
app.use((req, res, next) => {
  if (typeof req.url === "string") {
    req.url = req.url.replace(/%0A/gi, "");
  }
  next();
});

//  2. CORS 
const allowOrigin = (origin, callback) => {
  if (!origin) return callback(null, true); // Postman / mobile / SSR

  const isAllowed =
    origin === "https://connect2-cure.vercel.app" ||
    origin === "https://connect2cure.onrender.com" ||
    origin === "http://localhost:5173"            ||
    origin === "http://localhost:3000"            ||
    /^https:\/\/connect2-cure[^.]*\.vercel\.app$/.test(origin) ||
    /^https:\/\/[^.]+\.divyamoswals-projects\.vercel\.app$/.test(origin);

  if (isAllowed) {
    callback(null, true);
  } else {
    console.warn("❌ CORS blocked:", origin);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  }
};

const corsOptions = {
  origin: allowOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  maxAge: 3600,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.options("/api/*", cors(corsOptions));

//  3. Stripe Webhook — RAW body, MUST be before express.json() 
app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

//  4. Body Parsers 
app.use(express.json());
app.use(cookieParser());

//  5. Logger 
app.use(morgan("dev"));

//  6. Database 
connectDB();

//  7. Static Files 
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//  8. API Routes 
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

//  9. Health Check 
app.get("/", (req, res) => {
  res.send("Connect2Cure backend running ✅");
});

//  10. Global Error Handler 
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;