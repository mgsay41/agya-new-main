import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Tag = mongoose.model("Tag", TagSchema);

export default Tag;
