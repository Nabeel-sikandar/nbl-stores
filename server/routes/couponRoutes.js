import express from "express";
import {
  createCoupon, validateCoupon, getAllCoupons, deleteCoupon,
} from "../controllers/couponController.js";
import authMiddleware, { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/validate", authMiddleware, validateCoupon);
router.get("/", adminAuth, getAllCoupons);
router.post("/", adminAuth, createCoupon);
router.delete("/:id", adminAuth, deleteCoupon);

export default router;