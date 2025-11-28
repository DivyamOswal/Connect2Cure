import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    phone: String,
    specialization: String,
    licenseNumber: String,
    yearsOfExperience: Number,
    clinicName: String,
    clinicAddress: String,
  },
  { timestamps: true }
);

export const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);
