import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    user:           { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    name:           String,
    email:          String,
    location:       String,
    degree:         String,
    specialization: String,
    bio:            String,
    experience:     String,
    fee:            Number,
    rating:         { type: Number, default: 0 },
    reviews:        { type: Number, default: 0 },
    timings:        [String],
    phone:          String,
    image:          String,
    isPublished:    { type: Boolean, default: true },

    //  Data Retention (NMC Act 2020 + DPDP Act 2023) 
    // Doctor registration/profile data: 5-year retention after deactivation
    // per NMC norms and DPDP Act data minimisation principle.
    // Set retainUntil manually when doctor account is deactivated.
    retainUntil: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 365.25 * 24 * 60 * 60 * 1000), // 5 years
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);
export default DoctorProfile;