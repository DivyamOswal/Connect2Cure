import sharp from "sharp";
import { uploadToS3 } from "../utils/s3Upload.js";

export const registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      location,
      degree,
      specialization,
      bio,
      experience,
      fee,
      phone,
      timings,
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 1️⃣ create user
    const user = await User.create({
      name,
      email,
      password,
      role: "doctor",
    });

    // 2️⃣ Upload image to S3 instead of local disk
    let imageUrl = "";

    if (req.file) {
      const key = `doctors/${user._id}-${Date.now()}.webp`;

      const buffer = await sharp(req.file.buffer)
        .resize(800, 800, { fit: "cover" })
        .webp({ quality: 70 })
        .toBuffer();

      imageUrl = await uploadToS3(buffer, key, "image/webp");
    }

    // 3️⃣ parse timings
    let timingsArray = [];
    if (timings) {
      try {
        timingsArray = JSON.parse(timings);
      } catch {
        timingsArray = [];
      }
    }

    // 4️⃣ create doctor profile
    await DoctorProfile.create({
      user: user._id,
      name,
      email,
      location: location || "",
      degree: degree || "",
      specialization: specialization || "",
      bio: bio || "",
      experience: experience || "",
      fee: Number(fee) || 0,
      rating: 0,
      reviews: 0,
      timings: timingsArray,
      phone: phone || "",
      image: imageUrl,
      isPublished: true,
    });

    // 5️⃣ issue tokens
    const { accessToken, refreshToken, payload } = makeTokens(user);

    const redisKey = `refresh:${payload.userId}:${refreshToken}`;
    await redis.set(redisKey, "valid", { ex: REFRESH_TTL_SEC });

    return res.status(201).json({
      message: "Doctor registered",
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
    console.error("registerDoctor error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};