// server/controllers/messageController.js
import Message from "../models/Message.js";
import Appointment from "../models/Appointment.js";

// build contact list from appointments
export const getThreads = async (req, res) => {
  try {
    const myId = req.user.userId;
    const myRole = req.user.role;

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

    const msgs = await Message.find({
      $or: [
        { sender: myId, receiver: { $in: otherIds } },
        { sender: { $in: otherIds }, receiver: myId },
      ],
    })
      .sort({ createdAt: -1 })
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

    res.json([...contactMap.values()]);
  } catch (err) {
    console.error("getThreads error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// full conversation between me and other user
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
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages);
  } catch (err) {
    console.error("getConversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// optional REST send (socket already saves, but this is handy for testing)
export const sendMessage = async (req, res) => {
  try {
    const sender = req.user.userId;
    const { receiver, text } = req.body;

    if (!receiver || !text?.trim()) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const message = await Message.create({
      sender,
      receiver,
      text: text.trim(),
    });

    res.json(message);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
