// server/routes/onboardingRoutes.js
import express from "express";
import { savePatientProfile, saveDoctorProfile } from "../controllers/onboardingController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/patient", auth(["patient"]), savePatientProfile);
router.post("/doctor", auth(["doctor"]), saveDoctorProfile);

export default router;
