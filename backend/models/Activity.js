import mongoose from "mongoose";
const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // This field is required
    },
    activityName: { type: String, required: true }, // Required
    activityType: { type: String, required: true }, // Required
    date: { type: String, required: true }, // Required
    time: { type: String, required: true }, // Required
    featuredImage: { type: String }, // Optional
    organization: { type: String }, // Optional
    location: { type: String }, // Optional
    price: { type: String }, // Optional
    sponsors: {
      type: [String], // Array of strings (URLs)
      validate: {
        validator: function (arr) {
          return arr.every((url) => typeof url === "string"); // Ensure all items are strings
        },
        message: "Sponsors must be an array of strings (URLs).",
      },
      default: [], // Optional: Default to an empty array
    },
    description: { type: String }, // Optional
    timeline: { type: String }, // Optional
    activityExLink: { type: String }, // Optional
    apply: { type: String }, // Optional
    isAdmin: { type: Boolean, default: false }, // Default to false
    status: {
      type: String,
      enum: ["pending", "rejected", "passed"],
      default: "pending", // Default to "pending"
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
