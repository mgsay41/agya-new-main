import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: { type:String , unique: true},
    otp : { type:String },
    createdAt : Date,
    expiresAt : Date,
  },
  { timestamps: true }
);

const OTP = mongoose.models.Otp || mongoose.model("OTP", OTPSchema);

export default OTP;
