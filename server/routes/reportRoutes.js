// server/routes/reportRoutes.js
import express from "express";
import multer from "multer";

import {
  analyzeReport,
  analyzeReportFile,
  downloadReportPdf,
  createShareLink,
  getSharedReport,
} from "../controllers/reportController.js";

// ✅ use your real auth middleware
import { auth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ---------------- AI ANALYSIS ----------------

// Text mode analysis – only logged-in patients
router.post("/analyze", auth(["patient"]), analyzeReport);

// File mode analysis – only logged-in patients
router.post(
  "/analyze-file",
  auth(["patient"]),
  upload.single("file"),
  analyzeReportFile
);

// ---------------- PDF DOWNLOAD ----------------

// PDF download – only logged-in patients (and controller checks owner)
router.get("/:id/pdf", auth(["patient"]), downloadReportPdf);

// ---------------- SHARING ----------------

// Create a shareable link – only logged-in patients (and controller checks owner)
router.post("/:id/share", auth(["patient"]), createShareLink);

// Public shared view – NO auth
router.get("/shared/:shareId", getSharedReport);

export default router;
