import Stripe from "stripe";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import { User } from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/**
 * POST /api/appointments/create-checkout-session
 * body: { doctorId, date, time }
 */
// controllers/appointmentController.js (what you showed earlier)
export const createCheckoutSession = async (req, res) => {
  try {
    const patientUserId = req.user.userId; // from auth middleware
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "Missing doctorId, date or time" });
    }

    const doctorProfile = await DoctorProfile.findById(doctorId).populate("user");
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const feeInRupees = doctorProfile.fee || 0;
    const amountInPaise = Math.round(feeInRupees * 100);

    if (amountInPaise <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid consultation fee for this doctor" });
    }

    // 1) Create appointment in DB with "pending" / "unpaid" status
    const appointment = await Appointment.create({
      doctor: doctorProfile._id,          // ref to DoctorProfile
      doctorUser: doctorProfile.user._id, // owning user of the doctor profile
      patientUser: patientUserId,         // logged-in user
      date,
      time,
      fee: feeInRupees,
      status: "pending",
    });

    // 2) Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: amountInPaise,
            product_data: {
              name: `Consultation with ${doctorProfile.name}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment._id.toString(),
      },
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment-cancelled`,
    });

    // Optionally store the session id on the appointment
    appointment.stripeSessionId = session.id;
    await appointment.save();

    // 3) Respond to the frontend with the checkout URL
    return res.json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * POST /api/appointments/confirm
 * body: { sessionId }
 */
export const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const appointmentId = session.metadata.appointmentId;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 👇 Do NOT auto-confirm here
    // appointment.status = "confirmed";  // remove / comment out
    appointment.stripePaymentIntentId = session.payment_intent;
    await appointment.save();

    return res.json({ message: "Payment recorded", appointment });
  } catch (err) {
    console.error("confirmPayment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /api/appointments/my (patient)
 */
export const getMyAppointments = async (req, res) => {
  try {
    const patientUserId = req.user.userId;

    const appts = await Appointment.find({ patientUser: patientUserId })
      .populate("doctor")
      .sort({ createdAt: -1 })
      .lean();

    res.json(appts);
  } catch (err) {
    console.error("getMyAppointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/appointments/doctor (doctor)
 */
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorUserId = req.user.userId;

    const appts = await Appointment.find({ doctorUser: doctorUserId })
      .populate("patientUser", "name email")
      .populate("doctor")
      .sort({ createdAt: -1 })
      .lean();

    res.json(appts);
  } catch (err) {
    console.error("getDoctorAppointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/appointments/earnings (doctor)
 */
export const getDoctorEarnings = async (req, res) => {
  try {
    const doctorUserId = req.user.userId;

    const appointments = await Appointment.find({
      doctorUser: doctorUserId,
      status: "confirmed",
    })
      .populate("patientUser", "name email")
      .populate("doctor", "name")
      .sort({ createdAt: -1 })
      .lean();

    const totalEarnings = appointments.reduce(
      (sum, a) => sum + (a.fee || 0),
      0
    );

    const today = new Date().toISOString().split("T")[0];

    const todayEarnings = appointments
      .filter((a) => a.date === today)
      .reduce((sum, a) => sum + a.fee, 0);

    return res.json({
      totalEarnings,
      todayEarnings,
      totalAppointments: appointments.length,
      currency: "INR",
      appointments, // include full detailed list
    });
  } catch (err) {
    console.error("getDoctorEarnings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/appointments/:id/confirm
export const confirmAppointmentByDoctor = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.userId; // doctor user ID from token

    // Find the appointment
    const appt = await Appointment.findById(appointmentId);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check authorization (doctor must own the appointment)
    if (appt.doctorUser.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Update status
    appt.status = "confirmed";
    await appt.save();

    return res.json({
      message: "Appointment approved successfully",
      appointment: appt,
    });
  } catch (err) {
    console.error("Doctor confirm error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
