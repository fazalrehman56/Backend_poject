import { Router } from "express";
import { registerUsers, loginUser, logoutUser, RefreshAccessToken, changeUserPassword,changeAvator,getCurrentUser,upadateUserDetails,changeCoverImg,getUserChannelProfile,getUserWatchedHistory } from "../controller/users.controller.js";
import { jwtVerify } from "../middlewear/Auth.js";
import { upload } from "../middlewear/multer.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  registerUsers
);

router.route("/login").post(loginUser);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/refresh-token").post(RefreshAccessToken)
router.route("/change-password").post(jwtVerify, changeUserPassword)
router.route("/current-user").get(jwtVerify, getCurrentUser)
router.route("/update-account").patch(jwtVerify, upadateUserDetails)

router.route("/avatar").patch(jwtVerify, upload.single("avatar"), changeAvator)
router.route("/cover-image").patch(jwtVerify, upload.single("coverImage"), changeCoverImg)

router.route("/c/:username").get(jwtVerify, getUserChannelProfile)
router.route("/history").get(jwtVerify, getUserWatchedHistory)

export default router;
