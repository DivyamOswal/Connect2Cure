import mongoose from "mongoose";

const billingTransactionSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stripeSessionId: { type: String, required: true, unique: true },
    planId:          { type: String, required: true },
    credits:         { type: Number, required: true },
    amount:          { type: Number, required: true },       // in paise
    currency:        { type: String, default: "inr" },
    status:          { type: String, default: "paid" },

    basePrice:    { type: Number, default: 0 },  // ₹
    gst:          { type: Number, default: 0 },  // ₹
    platformFee:  { type: Number, default: 0 },  // ₹
    total:        { type: Number, default: 0 },  // ₹

    //Data Retention (GST Act + Income Tax Act, India) 
    // Financial/billing records: mandatory 8-year retention per GST Act §36
    // and Income Tax Act §44AA. TTL set to 8 years from creation.
    retainUntil: {
      type: Date,
      default: () => new Date(Date.now() + 8 * 365.25 * 24 * 60 * 60 * 1000), // 8 years
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("BillingTransaction", billingTransactionSchema);