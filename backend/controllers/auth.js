import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
// import otpGenerator from "otp-generator";
// import { sendMail } from "./mailer.js";

const secret = "aTWbeQsdwdevd122421jhjgngh@#@!#$awwqQe";

export const register = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    affiliation,
    academic_title,
    confirmPassword,
  } = req.body;

  // validate
  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !affiliation ||
    !academic_title ||
    !confirmPassword
  ) {
    return res.json({
      success: false,
      message: "please fill all the fields",
    });
  }
  if (password.length < 6) {
    return res.json({
      success: false,
      message: "password must be at least 6 characters",
    });
  }
  if (password != confirmPassword) {
    return res.json({
      success: false,
      message: "Confirm Password no match password",
    });
  }

  // const existUsername = await User.findOne({ username });
  const existEmail = await User.findOne({ email });

  // if (existUsername) {
  //   return res.json({
  //     success: false,
  //     message: "the username already exists",
  //   });
  // }

  if (existEmail) {
    return res.json({
      success: false,
      message: "the email already exists, try with different email",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  
  const user = await User.create({
    firstname,
    lastname,
    email,
    affiliation,
    academic_title,
    password: hashPassword,
  });

  if (user) {
    res.json({
      success: true,
      message: "Registration successful",
    });
  } else {
    res.json({
      success: false,
      message: "Registration failed",
    });
  }
};

// =================== Starting Login ==================

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "please fill all the fields",
    });
  }

  const user = await User.findOne({ email });
  
  const ban = await User.findOne({ email ,  status : 'ban' });

   if (ban) {
    return res.json({
      success: false,
      message: "this user has banned",
    });
  }



  if (!user) {
    return res.json({
      success: false,
      message: "this user is not exist",
    });
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (user && passwordIsCorrect) {
    jwt.sign(
      {
        email,
        id: user._id,
        firstname: user.firstname,
        image: user.image,
        createdAt: user.createdAt,
      },
      secret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({
          success: true,
          message: "Login successful",
          email: user.email,
          id: user._id,
          firstname: user.firstname,
          image: user.image,
          createdAt: user.createdAt,
        });
      }
    );
  } else {
    res.json({
      success: false,
      message: "Invalid password or email",
    });
  }
};
// =================== Ending Login ==================
export const Adminlogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "please fill all the fields",
    });
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.json({
      success: false,
      message: "this user is not exist",
    });
  }

  const passwordIsCorrect = await bcrypt.compare(password, admin.password);
  if (admin && passwordIsCorrect) {
    jwt.sign(
      {
        email,
        id: admin._id,
        firstname: admin.firstname,
        image: admin.image,
        createdAt: admin.createdAt,
      },
      secret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({
          success: true,
          message: "Login successful",
          email: admin.email,
          id: admin._id,
          firstname: admin.firstname,
          image: admin.image,
          createdAt: admin.createdAt,
        });
      }
    );
  } else {
    res.json({
      success: false,
      message: "Invalid password or email",
    });
  }
};
// =================== Ending Login ==================
// =================== Starting Logout =========================

export const Logout = async (req, res) => {
  res.cookie("token", "", { maxAge: 0 }).json({
    success: true,
    massage: " تم تسجيل الخروج ",
  });
};

// =================== Ending Logout =========================

export const SingleUser = async (req, res) => {
  const { id } = req.params;

  const extractUser = await User.findById(id);

  if (extractUser) {
    return res.json({
      success: true,
      data: extractUser,
    });
  } else {
    return res.json({
      success: false,
      message: "not found ",
    });
  }
};

// =================== Starting updatedUser =========================

export const updatedUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (user) {
    return res.json({
      success: true,
      message: "updated successfully ",
    });
  }
  if (!user) {
    return res.json({
      success: false,
      message: " no user with this id ",
    });
  }
};
// =================== Ending updatedUser =========================

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (user) {
    return res.json({
      success: true,
      message: " user deleted successfully",
    });
  }
  if (!user) {
    return res.json({
      success: false,
      message: "No user found with this ID",
    });
  }
};

export const ResetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (newPassword.length < 6) {
    return res.json({
      success: false,
      message: "password is too short",
    });
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);
  const user = await User.updateOne({ _id: id },{password: hashPassword});
  if (user) {
    res.json({
      success: true,
      message: " password is updeted successfully",
    });
  } else {
    res.json({
      success: false,
      message: " password is not updeted",
    });
  }
};

export const ResetPasswordAdmin = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (newPassword.length < 6) {
    return res.json({
      success: false,
      message: "password is too short",
    });
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);

  const user = await Admin.updateOne({ _id: id }, {password: hashPassword });
  if (user) {
    res.json({
      success: true,
      message: " password is updeted successfully",
    });
  } else {
    res.json({
      success: false,
      message: " password is not updeted",
    });
  }
};

