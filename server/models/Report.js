// server/models/Report.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const chartsSchema = new Schema(
  {
    termsFrequency: {
      type: [Number],
      default: [],
    },
    categories: {
      // array of plain strings
      type: [String],
      default: [],
    },
    severityDots: {
      type: [Number],
      default: [],
    },
  },
  { _id: false }
);

const reportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rawText: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    medicalTerms: {
      type: [String],
      default: [],
    },
    charts: {
      type: chartsSchema,
      default: () => ({}),
    },

    // 🔹 NEW: sharing fields for public link + QR
    shareId: {
      type: String,
      unique: true,
      sparse: true, // allows many docs without shareId
    },
    sharedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
