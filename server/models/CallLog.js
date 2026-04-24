import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema(
  {
    caller:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: ["ringing", "missed", "completed", "rejected"],
      default: "ringing",
    },

    callId:    { type: String, index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt:   { type: Date },
    duration:  { type: Number, default: 0 }, // seconds

    // Data Retention (IT Act 2000 + TRAI Regulations)
    // Telecom/communication logs: 3-year retention per IT Act §67C and
    // TRAI guidelines. After 3 years records auto-expire via TTL.
    retainUntil: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 365.25 * 24 * 60 * 60 * 1000), // 3 years
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

callLogSchema.pre("save", function (next) {
  if (this.startedAt && this.endedAt) {
    this.duration = Math.floor((this.endedAt - this.startedAt) / 1000);
  }
  next();
});

const CallLog = mongoose.model("CallLog", callLogSchema);
export default CallLog;