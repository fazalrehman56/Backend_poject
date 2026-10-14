import { Router } from "express";
import registerUsers from "../controller/users.controller.js"; // 
import { upload } from "../middlewear/multer.js";
import loginUser from "../controller/users.controller.js"
import { jwtVerify } from "../middlewear/Auth.js";
import logoutUser from "../middlewear/Auth.js"
const router = Router();

router.route("/register").post(upload.fields([
    {
        name : "avatar",
        maxCount :1,
    },
    {
       name : "coverImg",
       maxCount : 1
    }
]),registerUsers);
router.route("/login").post(loginUser)
router.route("/logout").post(jwtVerify,logoutUser)


export default router;