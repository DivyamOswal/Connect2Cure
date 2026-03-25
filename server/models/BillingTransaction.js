// server/models/BillingTransaction.js
import mongoose from "mongoose";

const billingTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    planId: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },

    // Stripe total amount (in paise)
    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "inr",
    },

    status: {
      type: String,
      default: "paid",
    },

    // 🔥 NEW FIELDS (ADD THESE)
    basePrice: {
      type: Number, // in ₹
      default: 0,
    },
    gst: {
      type: Number, // in ₹
      default: 0,
    },
    platformFee: {
      type: Number, // in ₹
      default: 0,
    },
    total: {
      type: Number, // in ₹ (base + gst + platform)
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "BillingTransaction",
  billingTransactionSchema
);