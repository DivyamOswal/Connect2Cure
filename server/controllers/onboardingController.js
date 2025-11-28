import { PatientProfile } from "../models/PatientProfile.js";
import { DoctorProfile } from "../models/DoctorProfile.js";
import { User } from "../models/User.js";

// PATIENT onboarding
export const savePatientProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware

    let profile = await PatientProfile.findOne({ user: userId });
    if (!profile) {
      profile = await PatientProfile.create({ user: userId, ...req.body });
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }

    await User.findByIdAndUpdate(userId, { onboardingCompleted: true });

    res.json({ message: "Patient profile saved", profile });
  } catch (err) {
    console.error("Patient onboarding error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DOCTOR onboarding
export const saveDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    let profile = await DoctorProfile.findOne({ user: userId });
    if (!profile) {
      profile = await DoctorProfile.create({ user: userId, ...req.body });
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }

    await User.findByIdAndUpdate(userId, { onboardingCompleted: true });

    res.json({ message: "Doctor profile saved", profile });
  } catch (err) {
    console.error("Doctor onboarding error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
