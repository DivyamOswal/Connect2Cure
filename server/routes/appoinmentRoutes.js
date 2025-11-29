import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createCheckoutSession,
  confirmPayment,
  getMyAppointments,
  getDoctorAppointments,
  getDoctorEarnings,
  confirmAppointmentByDoctor,
} from "../controllers/appointmentController.js";

const router = express.Router();

// patient creates booking & payment session
router.post(
  "/create-checkout-session",
  auth(["patient"]),
  createCheckoutSession
);

// called from payment-success page
router.post("/confirm", auth(), confirmPayment);

// patient view appointments
router.get("/my", auth(["patient"]), getMyAppointments);

// doctor view appointments
router.get("/doctor", auth(["doctor"]), getDoctorAppointments);

// doctor earnings
router.get("/earnings", auth(["doctor"]), getDoctorEarnings);

router.patch("/:id/confirm", auth(["doctor"]), confirmAppointmentByDoctor);


export default router;
