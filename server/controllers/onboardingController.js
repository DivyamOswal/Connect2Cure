import multer from "multer";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { PatientProfile } from "../models/PatientProfile.js";
import DoctorProfile  from "../models/DoctorProfile.js";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });
export const uploadDoctorAvatar = upload.single("image");

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

// GET doctor onboarding profile
export const getDoctorOnboarding = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can access this" });
    }

    const profile = await DoctorProfile.findOne({ user: userId }).lean();

    res.json(profile || null);  // return null if no profile yet
  } catch (err) {
    console.error("Get doctor onboarding error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// DOCTOR onboarding
export const saveDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Ensure only doctors can access
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can update this." });
    }

    // Extract fields
    const {
      name,
      location,
      degree,
      specialization,
      bio,
      experience,
      fee,
      phone,
      timings,
    } = req.body;

    // Convert timings JSON → array
    let timingsArray = [];
    try {
      timingsArray = timings ? JSON.parse(timings) : [];
    } catch {
      timingsArray = [];
    }

    let updateData = {
      name,
      location,
      degree,
      specialization,
      bio,
      experience,
      fee: Number(fee) || 0,
      phone,
      timings: timingsArray,
      isPublished: true, // Publish after onboarding
    };

    // Handle IMAGE COMPRESSION
    if (req.file) {
      const filename = `doctor-${userId}-${Date.now()}.webp`;
      const outputPath = path.join(__dirname, "..", "uploads", "doctors", filename);

      await sharp(req.file.buffer)
        .resize(800, 800, { fit: "cover" })
        .webp({ quality: 70 })
        .toFile(outputPath);

      updateData.image = `/uploads/doctors/${filename}`;
    }

    // Find or create profile
    let profile = await DoctorProfile.findOne({ user: userId });

    if (!profile) {
      profile = await DoctorProfile.create({ user: userId, ...updateData });
    } else {
      Object.assign(profile, updateData);
      await profile.save();
    }

    // Mark onboarding as completed
    await User.findByIdAndUpdate(userId, { onboardingCompleted: true });

    res.json({
      message: "Doctor profile saved successfully",
      profile,
    });
  } catch (err) {
    console.error("Doctor onboarding error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

