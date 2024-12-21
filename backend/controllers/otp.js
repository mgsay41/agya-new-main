import OTP from "../models/otp.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendMail } from "./mailer.js";
export const SendOTP = async (req, res) => {
  try {
    const { email, message, duration = 1 } = req.body;
    if (!(email && message)) {
      return res.json({
        success: false,
        message: "enter your email",
      });
    }
    const userFound = await User.findOne({ email });
    if (userFound) {
      // clear any old record
      await OTP.deleteOne({ email });
      // generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const hashedOTP = await bcrypt.hash(otp, 10);
      const user = await OTP.create({
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000 * +duration,
      });
      if (user) {
        await sendMail(
          email,
          `<p>${message}</p> <p style="font-size:24px"><b>${otp}</b></p> <p> this code <b> expires in ${duration} hour</b></p>`,
          "reastPassord"
        );
        return res.json({
          success: true,
          message: "code has been sent",
        });
      }
    } else {
      return res.json({
        success: false,
        message: " this email does not exist",
      });
    }
  } catch (e) {}
};
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!(email && otp)) {
    return res.json({
      success: false,
      message: " enter the code",
    });
  }
  const matchedOTP = await OTP.findOne({ email });

  const user = await User.findOne({ email });

  if (!matchedOTP) {
    return res.json({
      success: true,
      message: "code is not exist ",
    });
  }
  const { expiresAt } = matchedOTP;
  if (expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    return res.json({
      success: false,
      message: " code expired",
    });
  }
  const hashedOTP = matchedOTP.otp;
  const valid = await bcrypt.compare(otp, hashedOTP);
  if (valid) {
    return res.json({
      success: true,
      message: " code is valid",
      user,
    });
  } else {
    return res.json({
      success: false,
      message: " code is not valid",
    });
  }
};
