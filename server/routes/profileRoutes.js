// server/routes/profileRoutes.js
import express from "express";
import { getMyProfile, updateMyProfile } from "../controllers/profileController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// /api/profile/me
router.get("/me", auth(), getMyProfile);
router.put("/me", auth(), updateMyProfile);

export default router;
