import express from "express";
import {
  getAllProducts, getProduct, addProduct, deleteProduct,
  updateProduct, updateStock, getInventoryStats,
} from "../controllers/productController.js";
import authMiddleware, { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/inventory", adminAuth, getInventoryStats);
router.get("/:id", getProduct);
router.post("/", adminAuth, addProduct);
router.put("/:id", adminAuth, updateProduct);
router.patch("/:id/stock", adminAuth, updateStock);
router.delete("/:id", adminAuth, deleteProduct);

export default router;