import express from "express";
import { signup, signin, adminSignin, getProfile, googleLogin } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/admin/signin", adminSignin);
router.post("/google", googleLogin); // Google Login route
router.get("/profile", authMiddleware, getProfile);

export default router;