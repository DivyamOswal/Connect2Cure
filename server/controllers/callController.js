import CallLog from "../models/CallLog.js";

/**
 * CREATE CALL (when user clicks call)
 */
export const createCallLog = async (req, res) => {
  try {
    const caller = req.user?.userId;
    const { receiver } = req.body;

    if (!caller || !receiver) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const call = await CallLog.create({
      caller,
      receiver,
      status: "ringing",
      startedAt: new Date(),
    });

    return res.json(call);
  } catch (err) {
    console.error("createCallLog error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ACCEPT CALL
 */
export const acceptCall = async (req, res) => {
  try {
    const call = await CallLog.findById(req.params.id);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "ringing"; // still active
    call.startedAt = new Date(); // reset start time
    await call.save();

    return res.json({ message: "Call accepted", call });
  } catch (err) {
    console.error("acceptCall error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * REJECT CALL (or MISSED)
 */
export const rejectCall = async (req, res) => {
  try {
    const call = await CallLog.findById(req.params.id);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "missed";
    call.endedAt = new Date();
    await call.save();

    return res.json({ message: "Call rejected" });
  } catch (err) {
    console.error("rejectCall error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * COMPLETE CALL (when ended normally)
 */
export const completeCall = async (req, res) => {
  try {
    const call = await CallLog.findById(req.params.id);

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "completed";
    call.endedAt = new Date();

    // 🔥 Calculate duration
    if (call.startedAt) {
      call.duration = Math.floor(
        (new Date() - new Date(call.startedAt)) / 1000
      ); // seconds
    }

    await call.save();

    return res.json({
      message: "Call completed",
      duration: call.duration || 0,
      call,
    });
  } catch (err) {
    console.error("completeCall error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET MY CALL HISTORY
 */
export const getMyCalls = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const calls = await CallLog.find({
      $or: [{ caller: userId }, { receiver: userId }],
    })
      .populate("caller", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(calls || []);
  } catch (err) {
    console.error("getMyCalls error:", err);
    res.status(500).json({ message: "Server error" });
  }
};