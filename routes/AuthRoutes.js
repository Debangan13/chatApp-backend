import { Router } from "express";
import {
    generateSignature,
	getUserInfo,
	login,
	signup,
	updateProfile,
	addProfileImage,
	removeProfileImage,
	logout
} from "../controllers/AuthControllers.js";
import { authenticatedUser } from "../middlewares/authentication.js";


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-info", authenticatedUser, getUserInfo);
router.post("/update-profile", authenticatedUser, updateProfile);
router.get("/get-signature", generateSignature);
router.post("/upload-profile-image",authenticatedUser,addProfileImage)
router.delete("/remove-profile-image",authenticatedUser,removeProfileImage)
router.post("/logout",logout)

export default router;
