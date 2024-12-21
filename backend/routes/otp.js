import express from "express";
import { SendOTP, verifyOTP } from "../controllers/otp.js";
const router = express.Router();

router.post("/sendOTP", SendOTP);
router.post("/verifyOTP", verifyOTP);

export default router;
