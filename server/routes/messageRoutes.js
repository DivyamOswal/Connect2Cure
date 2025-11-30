// server/routes/messageRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { auth } from "../middleware/auth.js";
import {
  getThreads,
  getConversation,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- existing chat routes ----------
router.get("/threads", auth(), getThreads);
router.get("/conversation/:userId", auth(), getConversation);
router.post("/send", auth(), sendMessage);

// ---------- FILE UPLOAD FOR CHAT ----------

// store under server/uploads/chat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This resolves to: <project-root>/server/uploads/chat
    cb(null, path.join(__dirname, "..", "uploads", "chat"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_")
      .toLowerCase();
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

  // full URL to file, e.g. http(s)://host/uploads/chat/<filename>
  const url = `${req.protocol}://${req.get(
    "host"
  )}/uploads/chat/${file.filename}`;

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
