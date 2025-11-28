import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";

dotenv.config();

const app = express();

// 🔹 Clean weird %0A from URL path
app.use((req, res, next) => {
  if (typeof req.url === "string") {
    req.url = req.url.replace(/%0A/gi, "");
  }
  next();
});

// Log the cleaned URL
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

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);

app.get("/", (req, res) => {
  res.send("Connect2Cure backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
