import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getDoctorSummary,
  getPatientSummary,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/doctor/summary", auth(["doctor"]), getDoctorSummary);
router.get("/patient/summary", auth(["patient"]), getPatientSummary);

export default router;