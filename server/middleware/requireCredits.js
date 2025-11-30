// server/middleware/requireCredits.js
import { User } from "../models/User.js";

export default async function requireCredits(req, res, next) {
  try {
    console.log("🔑 requireCredits hit, req.user =", req.user);

    // Ensure auth middleware worked
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Load full user doc
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check credits
    if ((user.credits ?? 0) <= 0) {
      return res.status(402).json({
        message: "Not enough credits",
        code: "NO_CREDITS",
      });
    }

    // Attach full mongoose document
    req.userDoc = user;

    next();
  } catch (err) {
    console.error("❌ requireCredits error:", err);
    return res.status(500).json({ message: "Server error in requireCredits" });
  }
}
