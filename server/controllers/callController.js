import CallLog from "../models/CallLog.js";

/**
 * POST /api/calls/create
 * Save when a call starts
 */
export const createCallLog = async (req, res) => {
  try {
    const { receiver } = req.body;
    const caller = req.user.userId;

    const call = await CallLog.create({
      caller,
      receiver,
      status: "ringing",
      startedAt: new Date(),
    });

    res.json(call);
  } catch (err) {
    console.error("createCallLog error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * PATCH /api/calls/:id/complete
 */
export const completeCall = async (req, res) => {
  try {
    await CallLog.findByIdAndUpdate(req.params.id, {
      status: "completed",
      endedAt: new Date(),
    });

    res.json({ message: "Call marked as completed" });
  } catch (err) {
    console.error("completeCall error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /api/calls/my
 */
export const getMyCalls = async (req, res) => {
  try {
    const userId = req.user.userId;

    const calls = await CallLog.find({
      $or: [{ caller: userId }, { receiver: userId }],
    })
      .populate("caller", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 });

    res.json(calls);
  } catch (err) {
    console.error("getMyCalls error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
