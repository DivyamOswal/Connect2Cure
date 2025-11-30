import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createCallLog,
  completeCall,
  getMyCalls,
} from "../controllers/callController.js";

const router = express.Router();

router.post("/create", auth(), createCallLog);
router.patch("/:id/complete", auth(), completeCall);
router.get("/my", auth(), getMyCalls);

export default router;