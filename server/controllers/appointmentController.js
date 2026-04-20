import Stripe from "stripe";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import { User } from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Appointment checkout
export const createCheckoutSession = async (req, res) => {
  try {
    const patientUserId = req.user?.userId;
    const { doctorId, date, time } = req.body;

    if (!patientUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "Missing doctorId, date or time" });
    }

    const doctorProfile = await DoctorProfile.findById(doctorId).populate("user");

    // 🚨 FIX: null safety
    if (!doctorProfile || !doctorProfile.user) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const feeInRupees = doctorProfile.fee || 0;
    const amountInPaise = Math.round(feeInRupees * 100);

    if (amountInPaise <= 0) {
      return res.status(400).json({ message: "Invalid consultation fee" });
    }

    // Create appointment safely
    const appointment = await Appointment.create({
      doctor: doctorProfile._id,
      doctorUser: doctorProfile.user._id,
      patientUser: patientUserId,
      date,
      time,
      fee: feeInRupees,
      status: "pending",
    });

    //Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: amountInPaise,
            product_data: {
              name: `Consultation with ${doctorProfile.name || "Doctor"}`,
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

    appointment.stripeSessionId = session.id;
    await appointment.save();

    return res.json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Conform Payment
export const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Missing sessionId" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const appointmentId = session.metadata?.appointmentId;

    if (!appointmentId) {
      return res.status(400).json({ message: "Invalid metadata" });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.stripePaymentIntentId = session.payment_intent;
    await appointment.save();

    return res.json({ message: "Payment recorded", appointment });
  } catch (err) {
    console.error("confirmPayment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get patient appointments
export const getMyAppointments = async (req, res) => {
  try {
    const patientUserId = req.user?.userId;

    if (!patientUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const appts = await Appointment.find({ patientUser: patientUserId })
      .populate("doctor")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(appts || []);
  } catch (err) {
    console.error("getMyAppointments error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get doctors appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorUserId = req.user?.userId;

    if (!doctorUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const appts = await Appointment.find({ doctorUser: doctorUserId })
      .populate("patientUser", "name email")
      .populate("doctor")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(appts || []);
  } catch (err) {
    console.error("getDoctorAppointments error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Doctor earnings
export const getDoctorEarnings = async (req, res) => {
  try {
    const doctorUserId = req.user?.userId;

    if (!doctorUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const appointments = await Appointment.find({
      doctorUser: doctorUserId,
      status: "confirmed",
    })
      .populate("patientUser", "name email")
      .populate("doctor", "name")
      .sort({ createdAt: -1 })
      .lean();

    const totalEarnings = (appointments || []).reduce(
      (sum, a) => sum + (a?.fee || 0),
      0
    );

    const today = new Date().toISOString().split("T")[0];

    const todayEarnings = (appointments || [])
      .filter((a) => a?.date === today)
      .reduce((sum, a) => sum + (a?.fee || 0), 0);

    return res.json({
      totalEarnings,
      todayEarnings,
      totalAppointments: appointments?.length || 0,
      currency: "INR",
      appointments: appointments || [],
    });
  } catch (err) {
    console.error("getDoctorEarnings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Appointment to be confirmed by the doctor
export const confirmAppointmentByDoctor = async (req, res) => {
  try {
    const appointmentId = req.params?.id;
    const userId = req.user?.userId;

    if (!appointmentId || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const appt = await Appointment.findById(appointmentId);

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 🚨 FIX: null-safe check
    if (!appt.doctorUser || appt.doctorUser.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

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