// server/controllers/messageController.js
import Message from "../models/Message.js";
import Appointment from "../models/Appointment.js";

/**
 * GET /api/messages/threads
 * Build contact list based on appointments
 * + attach last message (from Message collection)
 */
export const getThreads = async (req, res) => {
  try {
    const myId = req.user.userId;
    const myRole = req.user.role;

    // 1) Find all active appointments for this user
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

    const contactMap = new Map(); // otherUserId -> { user, lastMessage }

    // 2) Build contact list from appointments
    for (const appt of appts) {
      const otherUser =
        String(appt.doctorUser._id) === String(myId)
          ? appt.patientUser
          : appt.doctorUser;

      const key = String(otherUser._id);
      if (!contactMap.has(key)) {
        contactMap.set(key, {
          user: {
            _id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email,
            role: otherUser.role,
          },
          lastMessage: null,
        });
      }
    }

    const otherIds = [...contactMap.keys()];
    if (otherIds.length === 0) return res.json([]);

    // 3) For those contacts, find latest Message between me and each of them
    const msgs = await Message.find({
      $or: [
        { sender: myId, receiver: { $in: otherIds } },
        { sender: { $in: otherIds }, receiver: myId },
      ],
    })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    for (const msg of msgs) {
      const otherId =
        String(msg.sender) === String(myId)
          ? String(msg.receiver)
          : String(msg.sender);

      if (contactMap.has(otherId) && !contactMap.get(otherId).lastMessage) {
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
 * Full conversation between me and other user
 */
export const getConversation = async (req, res) => {
  try {
    const myId = req.user.userId;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId },
      ],
    })
      .sort({ createdAt: 1 }) // oldest → newest
      .lean();

    return res.json(messages);
  } catch (err) {
    console.error("getConversation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/messages/send   (optional helper; sockets already save messages)
 * JSON: { receiver, text, attachment }  // attachment optional
 */
export const sendMessage = async (req, res) => {
  try {
    const sender = req.user.userId;
    const { receiver, text, attachment } = req.body;

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
 * Multipart form-data: file
 * Uses multer middleware to populate req.file
 */
export const uploadAttachment = async (req, res) => {
  try{
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    // Adjust SERVER_URL depending on your setup
    const baseUrl =
      process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

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
