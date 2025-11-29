// server/models/Message.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const attachmentSchema = new Schema(
  {
    url: String,          // full URL or relative path
    filename: String,     // stored filename on disk
    originalName: String, // original file name
    mimeType: String,
    size: Number,
  },
  { _id: false }
);

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, trim: true, default: "" },
    attachment: attachmentSchema, // 👈 new
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
