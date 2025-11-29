
import express from "express";
import {
  register,
  login,
  refreshTokenHandler,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  uploadDoctorImage
} from "../controllers/authController.js"; 
import { auth } from "../middleware/auth.js";
import { registerDoctor } from "../controllers/registerDoctor.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logout);
router.get("/me", auth(), getProfile);
router.put("/me", auth(), updateProfile);
router.post("/change-password", auth(), changePassword);
router.post("/register-doctor",uploadDoctorImage,registerDoctor);

export default router;
