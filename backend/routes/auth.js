import express  from "express";
import { deleteUser, login, Logout, register , ResetPassword , Adminlogin, ResetPasswordAdmin, SingleUser,updatedUser } from "../controllers/auth.js";
const router = express.Router();
import isAuth from '../middleware/auth.js';

router.post("/register", register) // register user

router.post("/login",login) // login user
router.post("/admin-login",Adminlogin) 


router.post("/logout", Logout)// logout user
router.post("/reset-password", ResetPassword)// logout user

//============ GET =========
router.get('/single-user/:id', SingleUser) 
//============ DELETE =========

router.delete("/delete-user/:id", deleteUser) // use to delete user 
router.post("/reset-password/:id",  ResetPasswordAdmin);



//============ PATCH =========

router.patch('/update-user/:id',updatedUser); // use to update user 


export default router;
