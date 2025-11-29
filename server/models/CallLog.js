// server/models/CallLog.js
import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["ringing", "missed", "completed"],
      default: "ringing",
    },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

const CallLog = mongoose.model("CallLog", callLogSchema);
export default CallLog;
