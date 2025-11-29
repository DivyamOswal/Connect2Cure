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
export const createCheckoutSession = async (req, res) => {
  try {
    const patientUserId = req.user.userId; // from auth middleware
    const { doctorId, date, time } = req.body;

    const doctorProfile = await DoctorProfile.findById(doctorId).populate("user");
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const feeInRupees = doctorProfile.fee || 0;
    const amountInPaise = Math.round(feeInRupees * 100);

    // 1) create appointment with pending status
    const appointment = await Appointment.create({
      doctor: doctorProfile._id,
      doctorUser: doctorProfile.user._id,
      patientUser: patientUserId,
      date,
      time,
      fee: feeInRupees,
      status: "pending",
    });

    // 2) create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Consultation with ${doctorProfile.name}`,
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment._id.toString(),
        doctorId: doctorProfile._id.toString(),
        patientUserId,
      },
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment-cancelled`,
    });

    // save session id on appointment
    appointment.stripeSessionId = session.id;
    await appointment.save();

    return res.json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    res.status(500).json({ message: "Server error" });
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

    appointment.status = "confirmed";
    appointment.stripePaymentIntentId = session.payment_intent;
    await appointment.save();

    return res.json({ message: "Appointment confirmed", appointment });
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
