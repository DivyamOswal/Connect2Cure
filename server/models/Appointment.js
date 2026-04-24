import mongoose from "mongoose";
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    doctor:      { type: Schema.Types.ObjectId, ref: "DoctorProfile", required: true },
    doctorUser:  { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientUser: { type: Schema.Types.ObjectId, ref: "User", required: true },

    date: { type: String, required: true },
    time: { type: String, required: true },
    fee:  { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    stripeSessionId:       String,
    stripePaymentIntentId: String,

    //  Data Retention (DPDP Act 2023 + NMC Guidelines) 
    // Medical appointment records must be retained for 7 years per NMC norms.
    // This TTL field enables automatic expiry; set it on document creation.
    retainUntil: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 365.25 * 24 * 60 * 60 * 1000), // 7 years
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, time: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;