// server/models/PatientProfile.js
import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    phone: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    bloodGroup: String,
    address: String,
    knownConditions: [String],
  },
  { timestamps: true }
);

export const PatientProfile = mongoose.model("PatientProfile", patientProfileSchema);