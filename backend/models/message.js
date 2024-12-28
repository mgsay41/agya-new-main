import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }, // User who will receive the message
  subject: { type: String, required: true }, // Subject of the message
  message: { type: String, required: true }, // Content of the message
  email: {
    type: String,
    required: true, // Ensure this field is required
  },
  senderName: { type: String, required: true }, // Name of the sender
  createdAt: { type: Date, default: Date.now }, // Timestamp when the message was created
  read: { type: Boolean, default: false }, // Optional: Track if the message has been read
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
