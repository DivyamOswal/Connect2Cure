// server/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";
import { redis } from "../config/redis.js";
import DoctorProfile from "../models/DoctorProfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });
export const uploadDoctorImage = upload.single("image");

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60;

const makeTokens = (user) => {
  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken, payload };
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role = "patient" } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ name, email, password, role });

    // auto-create doctor profile for doctors
    if (role === "doctor") {
      await DoctorProfile.create({
        user: user._id,
        name,
        email,
        location: "",
        degree: "",
        specialization: "",
        bio: "",
        experience: "",
        fee: 0,
        rating: 0,
        reviews: 0,
        timings: [],
        phone: "",
        image: "",
        isPublished: true, // set true after onboarding/profile completion
      });
    }

    return res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // if client specifies a role, make sure it matches
    if (role && user.role !== role) {
      return res.status(400).json({
        message: `This account is registered as ${user.role}. Please login as a ${user.role}.`,
      });
    }
    const { accessToken, refreshToken, payload } = makeTokens(user);
    const redisKey = `refresh:${payload.userId}:${refreshToken}`;
    await redis.set(redisKey, "valid", { ex: REFRESH_TTL_SEC });

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// RefreshToken
export const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const redisKey = `refresh:${payload.userId}:${refreshToken}`;
    const exists = await redis.get(redisKey);

    if (!exists) {
      return res
        .status(401)
        .json({ message: "Refresh token invalid or expired" });
    }
    const accessToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );
    return res.json({ accessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token" });
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const redisKey = `refresh:${payload.userId}:${refreshToken}`;
      await redis.del(redisKey);
    } catch {
      // ignore
    }
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get the Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// UpdateProfile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, gender, dob, avatar } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (phone !== undefined) update.phone = phone;
    if (gender !== undefined) update.gender = gender;
    if (dob !== undefined) update.dob = dob;
    if (avatar !== undefined) update.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user.userId, update, {
      new: true,
    })
      .select("-password")
      .lean();
    return res.json(user);
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ChangePassword
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Current password incorrect" });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    return res.json({ message: "Password updated" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
