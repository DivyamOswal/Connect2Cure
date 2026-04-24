import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    phone:           String,
    dateOfBirth:     Date,
    gender:          { type: String, enum: ["male", "female", "other"], default: "other" },
    bloodGroup:      String,
    address:         String,
    knownConditions: [String],

    //  Data Retention (DPDP Act 2023 + ABDM Health Data Policy) 
    // Patient health profiles: 7-year retention per ABDM/NMC guidelines.
    // Resets retainUntil on each profile update to extend from last activity.
    retainUntil: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 365.25 * 24 * 60 * 60 * 1000), // 7 years
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

// Refresh retention window on every save (activity-based retention)
patientProfileSchema.pre("save", function (next) {
  this.retainUntil = new Date(Date.now() + 7 * 365.25 * 24 * 60 * 60 * 1000);
  next();
});

export const PatientProfile = mongoose.model("PatientProfile", patientProfileSchema);