import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityName: { type: String, required: true },
    activityType: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    featuredImage: { type: String },
    organization: { type: String },
    location: { type: String },
    price: { type: String },
    sponsors: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.every((url) => typeof url === "string");
        },
        message: "Sponsors must be an array of strings (URLs).",
      },
      default: [],
    },
    description: { type: String },
    timeline: { type: String },
    activityExLink: { type: String },
    apply: { type: String },
    isAdmin: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "rejected", "passed"],
      default: "pending",
    },
    appliedNumber: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
