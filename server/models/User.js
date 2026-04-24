import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name:                { type: String, required: true },
    email:               { type: String, required: true, unique: true, lowercase: true },
    password:            { type: String, required: true },
    role:                { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    credits:             { type: Number, default: 1 },
    onboardingCompleted: { type: Boolean, default: false },

    // Data Retention (DPDP Act 2023 §8 — Data Minimisation)
    // User account data: retained for 4 years from last activity.
    // retainUntil is refreshed on every login/activity (update externally).
    // Inactive accounts auto-expire after 4 years per DPDP Act guidelines.
    retainUntil: {
      type: Date,
      default: () => new Date(Date.now() + 4 * 365.25 * 24 * 60 * 60 * 1000), // 4 years
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);