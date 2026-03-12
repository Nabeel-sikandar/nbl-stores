// Product Model — SKU + size-wise stock (fixed)
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Men", "Women", "Kids"],
      required: true,
    },
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, default: 0 },
      },
    ],
    totalStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// FIX: async function, no "next" parameter
productSchema.pre("save", async function () {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((sum, s) => sum + s.stock, 0);
  }
});

const Product = mongoose.model("Product", productSchema);
export default Product;