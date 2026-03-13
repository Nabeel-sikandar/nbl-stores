// Order Controller — Place order, Get orders, Update status
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { useCoupon } from "./couponController.js";

// ==================== PLACE ORDER (User) — with stock subtract + discount ====================
export const placeOrder = async (req, res) => {
  try {
    const { items, shippingInfo, subtotal } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "No items in order" });
    }

    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      return res.status(400).json({ msg: "Shipping info is required" });
    }

    // Stock check + subtract karo har item ke liye
    for (const item of items) {
      if (!item.product) continue;

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ msg: `Product "${item.title}" not found` });
      }

      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (!sizeObj) {
        return res.status(400).json({ msg: `Size ${item.size} not available for "${item.title}"` });
      }

      if (sizeObj.stock < item.quantity) {
        return res.status(400).json({
          msg: `"${item.title}" (${item.size}) — only ${sizeObj.stock} left, you ordered ${item.quantity}`,
        });
      }

      sizeObj.stock -= item.quantity;
      await product.save();
    }

    // Discount + total calculation
    const discount = Math.min(req.body.discount || 0, subtotal); // discount subtotal se zyada nahi
    const couponCode = req.body.couponCode || null;
    const afterDiscount = Math.max(subtotal - discount, 0); // negative nahi hoga
    const finalShipping = afterDiscount >= 5000 ? 0 : 200;
    const finalTotal = afterDiscount + finalShipping;

    const newOrder = new Order({
      user: req.user.id,
      items,
      shippingInfo,
      paymentMethod: "Cash on Delivery",
      subtotal,
      discount,
      couponCode,
      shippingFee: finalShipping,
      total: finalTotal,
      status: "Pending",
    });

    await newOrder.save();

    // Coupon use count increment
    if (couponCode) {
      await useCoupon(couponCode);
    }

    res.status(201).json({
      msg: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place Order Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== GET MY ORDERS (User) ====================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get My Orders Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== GET ALL ORDERS (Admin) ====================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get All Orders Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== GET SINGLE ORDER (Admin/User) ====================
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (req.user.role !== "admin" && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Get Order Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== UPDATE ORDER STATUS (Admin) ====================
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ msg: "Order status updated", order });
  } catch (error) {
    console.error("Update Order Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== DELETE ORDER (Admin) ====================
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete Order Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== GET ORDER STATS (Admin Dashboard) ====================
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const processingOrders = await Order.countDocuments({ status: "Processing" });
    const shippedOrders = await Order.countDocuments({ status: "Shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });

    const revenueResult = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Order Stats Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};