import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please add your first name"],
    },
    lastname: {
      type: String,
      required: [true, "Please add your last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    image: {
      type: String,
      default: "/uploads/default.png", // Default value if no image is provided
    },
    affiliation: {
      type: String,
    },
    academic_title: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ban", "warned", "normal"], // Only these values are allowed
      default: "normal",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

// Export the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
