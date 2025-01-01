import express  from "express";
import { deleteUser, login, Logout, register , ResetPassword, SingleUser,updatedUser } from "../controllers/auth.js";
const router = express.Router();
import isAuth from '../middleware/auth.js';

router.post("/register", register) // register user

router.post("/login",login) // login user

router.post("/logout", Logout)// logout user
router.post("/reset-password", ResetPassword)// logout user

//============ GET =========
router.get('/single-user/:id', SingleUser) 
//============ DELETE =========

router.delete("/delete-user/:id", deleteUser) // use to delete user 



//============ PATCH =========

router.patch('/update-user/:id',updatedUser); // use to update user 


export default router;