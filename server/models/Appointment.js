// models/Appointment.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
    doctorUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // just this one:
    patientUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,   // <-- make it required instead
    },

    date: { type: String, required: true },
    time: { type: String, required: true },

    fee: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    stripeSessionId: String,
    stripePaymentIntentId: String,
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, time: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;