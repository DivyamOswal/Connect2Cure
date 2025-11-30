// server/routes/messageRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { auth } from "../middleware/auth.js";
import {
  getThreads,
  getConversation,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// ---------- existing chat routes ----------
router.get("/threads", auth(), getThreads);
router.get("/conversation/:userId", auth(), getConversation);
router.post("/send", auth(), sendMessage);

// ---------- FILE UPLOAD FOR CHAT ----------

// store under /uploads/chat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "chat"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/messages/upload
router.post("/upload", auth(), upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.file;

  // full URL to file (adjust if needed)
  const url = `${req.protocol}://${req.get("host")}/uploads/chat/${file.filename}`;

  const attachment = {
    url,
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };

  return res.json({ attachment });
});

export default router;