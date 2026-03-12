// Coupon Model
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number, // percentage discount (e.g. 10 = 10%)
      required: true,
      min: 1,
      max: 100,
    },
    minOrder: {
      type: Number, // minimum order amount
      default: 0,
    },
    maxUses: {
      type: Number, // kitni baar use ho sakta hai
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;