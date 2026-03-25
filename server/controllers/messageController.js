import Message from "../models/Message.js";
import Appointment from "../models/Appointment.js";

/**
 * GET /api/messages/threads
 */
export const getThreads = async (req, res) => {
  try {
    const myId = req.user?.userId;
    const myRole = req.user?.role;

    if (!myId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1) Appointment filter
    let apptMatch = {
      status: { $in: ["pending", "confirmed"] },
    };

    if (myRole === "doctor") {
      apptMatch.doctorUser = myId;
    } else if (myRole === "patient") {
      apptMatch.patientUser = myId;
    } else {
      apptMatch.$or = [{ doctorUser: myId }, { patientUser: myId }];
    }

    const appts = await Appointment.find(apptMatch)
      .populate("doctorUser", "name email role")
      .populate("patientUser", "name email role")
      .lean();

    const contactMap = new Map();

    // 2) Build contacts safely
    for (const appt of appts) {
      // 🚨 skip broken data
      if (!appt?.doctorUser || !appt?.patientUser) continue;

      const isDoctor =
        String(appt.doctorUser?._id) === String(myId);

      const otherUser = isDoctor
        ? appt.patientUser
        : appt.doctorUser;

      if (!otherUser || !otherUser._id) continue;

      const key = String(otherUser._id);

      if (!contactMap.has(key)) {
        contactMap.set(key, {
          user: {
            _id: otherUser._id,
            name: otherUser.name || "",
            email: otherUser.email || "",
            role: otherUser.role || "",
          },
          lastMessage: null,
        });
      }
    }

    const otherIds = [...contactMap.keys()];
    if (otherIds.length === 0) return res.json([]);

    // 3) Fetch messages
    const msgs = await Message.find({
      $or: [
        { sender: myId, receiver: { $in: otherIds } },
        { sender: { $in: otherIds }, receiver: myId },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    // 4) Attach last message
    for (const msg of msgs) {
      if (!msg) continue;

      const otherId =
        String(msg.sender) === String(myId)
          ? String(msg.receiver)
          : String(msg.sender);

      if (
        contactMap.has(otherId) &&
        !contactMap.get(otherId).lastMessage
      ) {
        contactMap.get(otherId).lastMessage = msg;
      }
    }

    return res.json([...contactMap.values()]);
  } catch (err) {
    console.error("getThreads error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/messages/conversation/:userId
 */
export const getConversation = async (req, res) => {
  try {
    const myId = req.user?.userId;
    const otherId = req.params?.userId;

    if (!myId || !otherId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.json(messages || []);
  } catch (err) {
    console.error("getConversation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/messages/send
 */
export const sendMessage = async (req, res) => {
  try {
    const sender = req.user?.userId;
    const { receiver, text, attachment } = req.body;

    if (!sender) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!receiver || (!text?.trim() && !attachment)) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const message = await Message.create({
      sender,
      receiver,
      text: text?.trim() || "",
      attachment: attachment || undefined,
    });

    return res.json(message);
  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/messages/upload
 */
export const uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    const baseUrl =
      process.env.SERVER_URL ||
      `http://localhost:${process.env.PORT || 5000}`;

    const url = `${baseUrl}/uploads/${file.filename}`;

    return res.json({
      attachment: {
        url,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  } catch (err) {
    console.error("uploadAttachment error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};