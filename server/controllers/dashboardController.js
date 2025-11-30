// controllers/dashboardController.js
import Appointment from "../models/Appointment.js";
import Message  from "../models/Message.js";
import DoctorProfile from "../models/DoctorProfile.js";

const getTodayString = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
};

// /doctor/summary
export const getDoctorSummary = async (req, res) => {
  try {
    // 🔍 Log basic info
    console.log("getDoctorSummary HIT");
    console.log("req.user:", req.user);

    if (!req.user || !req.user.userId) {
      console.error("getDoctorSummary: missing req.user.userId");
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user.userId;

    const profile = await DoctorProfile.findOne({ user: userId })
      .select("_id")
      .lean();

    console.log("DoctorProfile for user:", userId, "=>", profile);

    if (!profile) {
      console.warn("No doctor profile found, returning empty stats");
      return res.json({
        stats: {
          totalAppointments: 0,
          upcomingAppointments: 0,
          todayAppointments: 0,
          unreadMessages: 0,
        },
        recentAppointments: [],
      });
    }

    const doctorId = profile._id;
    const todayStr = getTodayString();

    const baseMatch = { doctor: doctorId };
    const statusMatch = { $in: ["pending", "confirmed"] };

    const upcomingMatch = {
      ...baseMatch,
      date: { $gte: todayStr },
      status: statusMatch,
    };

    const todayMatch = {
      ...baseMatch,
      date: todayStr,
      status: statusMatch,
    };

    console.log("baseMatch:", baseMatch);
    console.log("upcomingMatch:", upcomingMatch);
    console.log("todayMatch:", todayMatch);

    const [
      totalAppointments,
      upcomingAppointments,
      todayAppointments,
      unreadMessages,
      rawRecentAppointments,
    ] = await Promise.all([
      Appointment.countDocuments(baseMatch),
      Appointment.countDocuments(upcomingMatch),
      Appointment.countDocuments(todayMatch),
      Message.countDocuments({ to: userId, read: false }),
      Appointment.find(baseMatch)
        .sort({ date: 1, time: 1 })
        .limit(20)
        .populate({ path: "patientUser", select: "name email" })
        .lean(),
    ]);

    console.log("Counts:", {
      totalAppointments,
      upcomingAppointments,
      todayAppointments,
      unreadMessages,
      recentCount: rawRecentAppointments.length,
    });

    const recentAppointments = rawRecentAppointments.map((appt) => ({
      ...appt,
      patient: appt.patientUser || null,
    }));

    return res.json({
      stats: {
        totalAppointments,
        upcomingAppointments,
        todayAppointments,
        unreadMessages,
      },
      recentAppointments,
    });
  } catch (err) {
    console.error("getDoctorSummary error stack:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
// /patient/summary
export const getPatientSummary = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const todayStr = getTodayString();

    // If you don't have legacy `patient` field anymore, you can simplify this:
    const baseMatch = { patientUser: patientId };

    const upcomingMatch = {
      ...baseMatch,
      date: { $gte: todayStr },
      status: { $in: ["pending", "confirmed"] },
    };

    const [totalAppointments, upcomingAppointments] = await Promise.all([
      Appointment.countDocuments(baseMatch),
      Appointment.countDocuments(upcomingMatch),
    ]);

    const upcomingListRaw = await Appointment.find(upcomingMatch)
      .sort({ date: 1, time: 1 })
      .limit(5)
      .populate({ path: "doctorUser", select: "name email" })
      .lean();

    return res.json({
      stats: {
        totalAppointments,
        upcomingAppointments,
      },
      upcomingAppointments: upcomingListRaw,
    });
  } catch (err) {
    console.error("getPatientSummary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};