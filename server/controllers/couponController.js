// Coupon Controller — create, validate, get all, delete
import Coupon from "../models/Coupon.js";

// CREATE COUPON (Admin)
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, minOrder, maxUses, expiresAt } = req.body;

    if (!code || !discount || !expiresAt) {
      return res.status(400).json({ msg: "Code, discount and expiry date are required" });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ msg: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount,
      minOrder: minOrder || 0,
      maxUses: maxUses || 100,
      expiresAt,
    });

    await coupon.save();
    res.status(201).json({ msg: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Create Coupon Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// VALIDATE COUPON (User — checkout pe)
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code) {
      return res.status(400).json({ msg: "Please enter a coupon code" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ msg: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ msg: "This coupon is no longer active" });
    }

    if (new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ msg: "This coupon has expired" });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ msg: "This coupon has reached its usage limit" });
    }

    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({ msg: `Minimum order of Rs. ${coupon.minOrder} required for this coupon` });
    }

    const discountAmount = Math.round((orderTotal * coupon.discount) / 100);

    res.status(200).json({
      msg: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Validate Coupon Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// USE COUPON (increment usedCount — call after order placed)
export const useCoupon = async (code) => {
  try {
    await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
  } catch (error) {
    console.error("Use Coupon Error:", error.message);
  }
};

// GET ALL COUPONS (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ coupons });
  } catch (error) {
    console.error("Get Coupons Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE COUPON (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Delete Coupon Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};