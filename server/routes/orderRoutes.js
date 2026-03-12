import express from "express";
import {
  placeOrder, getMyOrders, getAllOrders, getOrder,
  updateOrderStatus, deleteOrder, getOrderStats,
} from "../controllers/orderController.js";
import authMiddleware, { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/stats", adminAuth, getOrderStats);
router.get("/", adminAuth, getAllOrders);
router.get("/:id", authMiddleware, getOrder);
router.put("/:id", adminAuth, updateOrderStatus);
router.delete("/:id", adminAuth, deleteOrder);

export default router;