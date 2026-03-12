// Product Controller — receives image URL from frontend (no file upload)
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Get Products Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json({ product });
  } catch (error) {
    console.error("Get Product Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ADD PRODUCT — receives base64 image from frontend
export const addProduct = async (req, res) => {
  try {
    const { sku, title, description, price, category, sizes, image } = req.body;

    if (!sku || !title || !description || !price || !category) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!image) {
      return res.status(400).json({ msg: "Product image is required" });
    }

    const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingSku) {
      return res.status(400).json({ msg: "SKU already exists" });
    }

    // Upload base64 image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "nbl-stores/products",
      transformation: [{ width: 800, height: 800, crop: "limit" }],
      timeout: 120000,
    });

    let parsedSizes = [];
    if (sizes && typeof sizes === "string") {
      parsedSizes = JSON.parse(sizes);
    } else if (Array.isArray(sizes)) {
      parsedSizes = sizes;
    } else {
      parsedSizes = [
        { size: "S", stock: 0 }, { size: "M", stock: 0 },
        { size: "L", stock: 0 }, { size: "XL", stock: 0 },
      ];
    }

    const newProduct = new Product({
      sku: sku.toUpperCase(),
      title,
      description,
      price: parseInt(price),
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      category,
      sizes: parsedSizes,
    });

    await newProduct.save();
    res.status(201).json({ msg: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Add Product Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { sku, title, description, price, category, sizes, image } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (image && image.startsWith("data:")) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "nbl-stores/products",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
        timeout: 120000,
      });
      product.image = uploadResult.secure_url;
      product.imagePublicId = uploadResult.public_id;
    }

    if (sku) product.sku = sku.toUpperCase();
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = parseInt(price);
    if (category) product.category = category;
    if (sizes) {
      product.sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    }

    await product.save();
    res.status(200).json({ msg: "Product updated successfully", product });
  } catch (error) {
    console.error("Update Product Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE STOCK ONLY
export const updateStock = async (req, res) => {
  try {
    const { sizes } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (sizes) product.sizes = sizes;
    await product.save();
    res.status(200).json({ msg: "Stock updated successfully", product });
  } catch (error) {
    console.error("Update Stock Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET INVENTORY STATS
export const getInventoryStats = async (req, res) => {
  try {
    const products = await Product.find();
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.totalStock, 0);
    const categoryStock = { Men: 0, Women: 0, Kids: 0 };
    let outOfStockCount = 0;
    let lowStockCount = 0;
    products.forEach((p) => {
      categoryStock[p.category] += p.totalStock;
      if (p.totalStock === 0) outOfStockCount++;
      else if (p.totalStock <= 10) lowStockCount++;
    });
    res.status(200).json({ totalProducts, totalStock, categoryStock, outOfStockCount, lowStockCount });
  } catch (error) {
    console.error("Inventory Stats Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};