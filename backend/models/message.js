import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who will receive the message
  subject: { type: String, required: true }, // Subject of the message
  message: { type: String, required: true }, // Content of the message
  senderName: { type: String, required: true }, // Name of the sender
  createdAt: { type: Date, default: Date.now }, // Timestamp when the message was created
  read: { type: Boolean, default: false }, // Optional: Track if the message has been read
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
