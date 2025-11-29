// server/controllers/profileController.js
import { User } from "../models/User.js";
import { PatientProfile } from "../models/PatientProfile.js";
import DoctorProfile from "../models/DoctorProfile.js";

// GetProfile
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .select("-password -__v")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = null;

    if (user.role === "patient") {
      profile = await PatientProfile.findOne({ user: userId }).lean();
    } else if (user.role === "doctor") {
      profile = await DoctorProfile.findOne({ user: userId }).lean();
    }

    return res.json({ user, profile });
  } catch (err) {
    console.error("getMyProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile/me
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name, email, profile: profileData = {} } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    let updatedProfile = null;

    if (user.role === "patient") {
      updatedProfile = await PatientProfile.findOneAndUpdate(
        { user: userId },
        { user: userId, ...profileData },
        { new: true, upsert: true }
      );
    } else if (user.role === "doctor") {
      updatedProfile = await DoctorProfile.findOneAndUpdate(
        { user: userId },
        { user: userId, ...profileData },
        { new: true, upsert: true }
      );
    }

    return res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
      },
      profile: updatedProfile,
    });
  } catch (err) {
    console.error("updateMyProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
