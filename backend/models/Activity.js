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
    sponsors: [
      {
        name: { type: String },
        logo: { type: String }, // URL for the logo
      },
    ],
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
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
