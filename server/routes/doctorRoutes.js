// server/routes/doctorRoutes.js
import express from "express";
import DoctorProfile from "../models/DoctorProfile.js";
import { auth } from "../middleware/auth.js";
import { getDoctorEarnings } from "../controllers/appointmentController.js";
import { getDoctorSummary } from "../controllers/dashboardController.js";

const router = express.Router();

/**
 * GET /api/doctors
 * List all published doctors
 */
router.get("/", async (req, res) => {
  try {
    const docs = await DoctorProfile.find({ isPublished: true }).lean();
    res.json(docs);
  } catch (err) {
    console.error("List doctors error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/doctors/earnings
 * Earnings for the currently logged-in doctor
 *
 * IMPORTANT: This must be BEFORE `/:id`
 */
router.get("/earnings", auth(["doctor"]), getDoctorEarnings);

/**
 * GET /api/doctors/dashboard
 * Doctor dashboard summary (used by some parts of frontend)
 *
 * IMPORTANT: This must also be BEFORE `/:id`
 */
router.get("/dashboard", auth(["doctor"]), getDoctorSummary);

/**
 * GET /api/doctors/:id
 * Single doctor detail
 */
router.get("/:id", async (req, res) => {
  try {
    const doc = await DoctorProfile.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doc);
  } catch (err) {
    console.error("Doctor detail error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
