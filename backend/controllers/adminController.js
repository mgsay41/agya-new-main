import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secret = "aTWbeQsdwdevd122421jhjgngh@#@!#$awwqQe";

// Create an admin
export const AddAdmin = async (req, res) => {

        const { email, password, firstname, lastname , image } = req.body;
        if (
          !firstname ||
          !lastname ||
          !email ||
          !password
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
        
        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        const hashPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            email,
            password: hashPassword, // Ensure password is hashed in production
            firstname,
            lastname,
                image,
        });
        await admin.save();

        if (admin) {
          return res.json({
            success: true,
            message: 'add admin successfully' ,
            data: admin,
          });
        } else {
          return res.json({
            success: false,
            message: ' not added' 
          });
        }
};

// Get all admin
export const GetAdmin = async (req, res) =>{
        const admins = await Admin.find();
        const numberOfAdmin = await Admin.countDocuments()
      if (admins) {
        return res.json({
          success: true,
          numberOfAdmin,
          data: admins,
        });
      } else {
        return res.json({
          success: false,
        });
      }
};
// Get single admins
export const GetSingleAdmin = async (req, res) =>{
    const {id} = req.params 
const admin = await Admin.findById(id);
      if (admin) {
        return res.json({
          success: true,
          data: admin,
        });
      } else {
        return res.json({
          success: false,

        });
      }
};

export const UpdataAdmin = async (req,res)=> {
  const {id} = req.params 
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (updatedAdmin) {
      return res.json({
        success: true,
        message: 'updata admin successfully' ,
        data: updatedAdmin,
      });
    } else {
      return res.json({
        success: false,
        message: ' not updata admin ' ,
      });
    }
}

// delete admin
export const DeleteAdmin = async (req, res) =>{
    const {id} = req.params 
      const admin = await Admin.findByIdAndDelete(id);
      if (admin) {
        return res.json({
          success: true,
          message:"admin deleted successfully"
        });
      } else {
        return res.json({
          success: false,
        });
      }
};

