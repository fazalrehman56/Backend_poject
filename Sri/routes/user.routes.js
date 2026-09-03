import { Router } from "express";
import registerUsers from "../controller/users.controller.js"; // 

const router = Router();

router.route("/register").post(registerUsers);

export default router;