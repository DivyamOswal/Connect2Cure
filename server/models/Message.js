import mongoose from "mongoose";
const { Schema } = mongoose;

const attachmentSchema = new Schema(
  {
    url:          String,
    filename:     String,
    originalName: String,
    mimeType:     String,
    size:         Number,
  },
  { _id: false }
);

const messageSchema = new Schema(
  {
    sender:     { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    text:       { type: String, default: "" },
    attachment: attachmentSchema,
    isRead:     { type: Boolean, default: false },

    //  Data Retention (IT Act §67C + DPDP Act 2023) 
    // Chat/messaging data in telemedicine: 3-year retention per IT Act §67C.
    // Messages with medical context may be manually extended if linked to case.
    retainUntil: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 365.25 * 24 * 60 * 60 * 1000), // 3 years
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);