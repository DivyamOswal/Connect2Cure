import mongoose from "mongoose";
const { Schema } = mongoose;

const chartsSchema = new Schema(
  {
    termsFrequency: { type: [Number], default: [] },
    categories:     { type: [String], default: [] },
    severityDots:   { type: [Number], default: [] },
  },
  { _id: false }
);

const reportSchema = new Schema(
  {
    user:         { type: Schema.Types.ObjectId, ref: "User", required: true },
    rawText:      { type: String, required: true },
    summary:      { type: String, required: true },
    medicalTerms: { type: [String], default: [] },
    charts:       { type: chartsSchema, default: () => ({}) },

    shareId:  { type: String, unique: true, sparse: true },
    sharedAt: { type: Date },

    // Data Retention (NMC Guidelines + DPDP Act 2023)
    // Medical reports/lab records: 7-year mandatory retention per NMC norms.
    // If report is actively shared (shareId set), retain for full 7 years.
    retainUntil: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 365.25 * 24 * 60 * 60 * 1000), // 7 years
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;