import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    name: String,
    email: String,
    location: String,        // "Delhi, India"
    degree: String,
    specialization: String,
    bio: String,

    experience: String,      // "15+ years"
    fee: Number,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    timings: [String],       // ["Mon–Sat 9:30 – 1:30", "Mon–Fri 4:00 – 7:00"]
    phone: String,
    image: String,           // "/uploads/doctors/xxx.webp"

    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);
export default DoctorProfile;