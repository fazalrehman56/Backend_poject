import { Router } from "express";
import registerUsers from "../controller/users.controller.js"; // 
import { upload } from "../middlewear/multer.js";
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
]),
registerUsers);

export default router;