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

    // 🔥 Call status lifecycle
    status: {
      type: String,
      enum: ["ringing", "missed", "completed", "rejected"],
      default: "ringing",
    },

    // 🔥 Unique call session (useful for sockets)
    callId: {
      type: String,
      index: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
    },

    // 🔥 Duration in seconds
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 Auto-calculate duration before save
callLogSchema.pre("save", function (next) {
  if (this.startedAt && this.endedAt) {
    this.duration = Math.floor(
      (this.endedAt - this.startedAt) / 1000
    );
  }
  next();
});

const CallLog = mongoose.model("CallLog", callLogSchema);

export default CallLog;