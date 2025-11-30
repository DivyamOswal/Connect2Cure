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
      type: String, // "basic" | "pro" | "premium"
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    // store amount in smallest units (paise), front-end will divide by 100
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
      default: "paid", // or 'paid', 'refunded', etc.
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "BillingTransaction",
  billingTransactionSchema
);
