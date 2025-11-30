// server/routes/onboardingRoutes.js
import express from "express";
import {
  getDoctorOnboarding,
  savePatientProfile,
  saveDoctorProfile,
  uploadDoctorAvatar
} from "../controllers/onboardingController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Patient onboarding
router.post("/patient", auth(["patient"]), savePatientProfile);

// Doctor onboarding: GET profile + POST update
router.get("/doctor", auth(["doctor"]), getDoctorOnboarding);

router.post(
  "/doctor",
  auth(["doctor"]),
  uploadDoctorAvatar,       // <-- Image upload + compression
  saveDoctorProfile         // <-- Save profile + mark onboardingCompleted
);

export default router;