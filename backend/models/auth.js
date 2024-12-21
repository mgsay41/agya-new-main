import express  from "express";
import { deleteUser, login, Logout, register , SingleUser,updatedUser } from "../controllers/auth.js";
const router = express.Router();

router.post("/register", register) // register user

router.post("/login",login) // login user

router.post("/logout", Logout)// logout user

//============ GET =========
router.get('/single-user/:id', SingleUser) 
//============ DELETE =========

router.delete("/delete-user/:id", deleteUser) // use to delete user 




//============ PATCH =========

router.patch('/update-user/:id',updatedUser); // use to update user 


export default router;