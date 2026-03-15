// Admin Panel — Full Featured: Real Charts, Dashboard, Products (Add/Edit/Delete), Stock, Inventory, Orders, Customers, Coupons, Settings
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import API from "../api/axios";
import "./AdminPanel.css";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AdminPanel = () => {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0, pendingOrders: 0, processingOrders: 0,
    shippedOrders: 0, deliveredOrders: 0, totalRevenue: 0,
  });
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0, totalStock: 0, categoryStock: { Men: 0, Women: 0, Kids: 0 },
    outOfStockCount: 0, lowStockCount: 0,
  });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Search & filters
  const [orderSearch, setOrderSearch] = useState("");
  const [orderDateFilter, setOrderDateFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // New product form
  const [newProduct, setNewProduct] = useState({
    sku: "", title: "", description: "", price: "", category: "Men",
    sizeS: "0", sizeM: "0", sizeL: "0", sizeXL: "0",
  });
  const [productImage, setProductImage] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  // Edit product
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProduct, setEditProduct] = useState({
    title: "", description: "", price: "", category: "Men",
    sizeS: "0", sizeM: "0", sizeL: "0", sizeXL: "0",
  });

  // Stock editing
  const [editingStock, setEditingStock] = useState(null);
  const [editSizes, setEditSizes] = useState([]);

  // Coupons
  const [newCoupon, setNewCoupon] = useState({
    code: "", discount: "", minOrder: "", maxUses: "100", expiresAt: "",
  });

  // Admin profile
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin", email: "admin@nblstores.com", currentPassword: "", newPassword: "",
  });

  // ==================== FETCH DATA ====================

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { fetchInventory(); }, []);
  useEffect(() => { fetchCoupons(); }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await API.get("/products");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await API.get("/orders");
      setOrders(res.data.orders);
      const recentNotifs = res.data.orders.slice(0, 4).map((o, i) => ({
        id: i + 1,
        text: `Order #${o._id.slice(-6)} from ${o.shippingInfo.fullName}`,
        time: new Date(o.createdAt).toLocaleDateString(),
        read: false,
      }));
      setNotifications(recentNotifs);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/orders/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await API.get("/products/inventory");
      setInventoryStats(res.data);
    } catch (error) {
      console.error("Fetch inventory error:", error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await API.get("/coupons");
      setCoupons(res.data.coupons);
    } catch (error) {
      console.error("Fetch coupons error:", error);
    }
  };

  // ==================== REAL CHART DATA ====================

  // Monthly revenue — from actual orders (delivered only)
  const getMonthlyRevenue = () => {
    const currentYear = new Date().getFullYear();
    const monthlyData = MONTHS.map((month, index) => {
      const monthOrders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === index && o.status === "Delivered";
      });
      const revenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      return { month, revenue };
    });
    return monthlyData;
  };

  // Weekly orders — from actual orders (last 7 days)
  const getWeeklyOrders = () => {
    const today = new Date();
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = DAYS[date.getDay()];
      const dayOrders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.toDateString() === date.toDateString();
      });
      weekData.push({ day: dayName, orders: dayOrders.length });
    }
    return weekData;
  };

  // Monthly orders count — all orders per month
  const getMonthlyOrders = () => {
    const currentYear = new Date().getFullYear();
    return MONTHS.map((month, index) => {
      const count = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === index;
      }).length;
      return { month, orders: count };
    });
  };

  const revenueData = getMonthlyRevenue();
  const weeklyOrdersData = getWeeklyOrders();

  // ==================== HANDLERS ====================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin/admin");
  };

  const handleSidebarClick = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAsRead = (id) => setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));

  // ===== PRODUCT HANDLERS =====
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(productImage);
      reader.onload = async () => {
        try {
          const sizesArray = [
            { size: "S", stock: parseInt(newProduct.sizeS) || 0 },
            { size: "M", stock: parseInt(newProduct.sizeM) || 0 },
            { size: "L", stock: parseInt(newProduct.sizeL) || 0 },
            { size: "XL", stock: parseInt(newProduct.sizeXL) || 0 },
          ];
          await API.post("/products", {
            sku: newProduct.sku, title: newProduct.title,
            description: newProduct.description, price: newProduct.price,
            category: newProduct.category, sizes: sizesArray, image: reader.result,
          });
          setNewProduct({ sku: "", title: "", description: "", price: "", category: "Men", sizeS: "0", sizeM: "0", sizeL: "0", sizeXL: "0" });
          setProductImage(null);
          fetchProducts(); fetchStats(); fetchInventory();
          alert("Product added successfully!");
        } catch (error) {
          alert(error.response?.data?.msg || "Failed to add product");
        } finally { setAddingProduct(false); }
      };
    } catch (error) {
      alert("Failed to read image file");
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts(); fetchStats(); fetchInventory();
    } catch (error) { alert("Failed to delete product"); }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product._id);
    const getStock = (size) => {
      const found = product.sizes.find((s) => s.size === size);
      return found ? found.stock.toString() : "0";
    };
    setEditProduct({
      title: product.title, description: product.description,
      price: product.price.toString(), category: product.category,
      sizeS: getStock("S"), sizeM: getStock("M"), sizeL: getStock("L"), sizeXL: getStock("XL"),
    });
  };

  const cancelEditProduct = () => {
    setEditingProduct(null);
    setEditProduct({ title: "", description: "", price: "", category: "Men", sizeS: "0", sizeM: "0", sizeL: "0", sizeXL: "0" });
  };

  const saveEditProduct = async (productId) => {
    try {
      const sizesArray = [
        { size: "S", stock: parseInt(editProduct.sizeS) || 0 },
        { size: "M", stock: parseInt(editProduct.sizeM) || 0 },
        { size: "L", stock: parseInt(editProduct.sizeL) || 0 },
        { size: "XL", stock: parseInt(editProduct.sizeXL) || 0 },
      ];
      await API.put(`/products/${productId}`, {
        title: editProduct.title, description: editProduct.description,
        price: editProduct.price, category: editProduct.category, sizes: sizesArray,
      });
      setEditingProduct(null);
      fetchProducts(); fetchInventory();
      alert("Product updated!");
    } catch (error) { alert("Failed to update product"); }
  };

  // ===== STOCK HANDLERS =====
  const startEditStock = (product) => {
    setEditingStock(product._id);
    setEditSizes(product.sizes.map((s) => ({ ...s })));
  };
  const cancelEditStock = () => { setEditingStock(null); setEditSizes([]); };
  const updateSizeStock = (index, value) => {
    const updated = [...editSizes];
    updated[index].stock = parseInt(value) || 0;
    setEditSizes(updated);
  };
  const saveStock = async (productId) => {
    try {
      await API.patch(`/products/${productId}/stock`, { sizes: editSizes });
      setEditingStock(null); setEditSizes([]);
      fetchProducts(); fetchInventory();
      alert("Stock updated!");
    } catch (error) { alert("Failed to update stock"); }
  };

  // ===== ORDER HANDLERS =====
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders(); fetchStats();
    } catch (error) { alert("Failed to update status"); }
  };

  // ===== COUPON HANDLERS =====
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await API.post("/coupons", newCoupon);
      setNewCoupon({ code: "", discount: "", minOrder: "", maxUses: "100", expiresAt: "" });
      fetchCoupons();
      alert("Coupon created!");
    } catch (error) { alert(error.response?.data?.msg || "Failed to create coupon"); }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await API.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (error) { alert("Failed to delete coupon"); }
  };

  // ===== FILTERS =====
  const filteredOrders = orders.filter((order) => {
    const customerName = order.shippingInfo?.fullName || order.user?.name || "";
    const matchSearch = customerName.toLowerCase().includes(orderSearch.toLowerCase()) || order._id.toString().includes(orderSearch);
    let matchDate = true;
    if (orderDateFilter !== "all") {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      if (orderDateFilter === "today") matchDate = orderDate.toDateString() === today.toDateString();
      else if (orderDateFilter === "week") matchDate = orderDate >= new Date(today - 7 * 24 * 60 * 60 * 1000);
      else if (orderDateFilter === "month") matchDate = orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
    }
    return matchSearch && matchDate;
  });

  const filteredProducts = products.filter((p) => p.title.toLowerCase().includes(productSearch.toLowerCase()));

  const stockFilteredProducts = products.filter((p) => {
    if (stockFilter === "all") return true;
    if (stockFilter === "out") return p.totalStock === 0;
    if (stockFilter === "low") return p.totalStock > 0 && p.totalStock <= 10;
    if (stockFilter === "in") return p.totalStock > 10;
    return true;
  });

  const lowStockProducts = products.filter((p) => p.totalStock > 0 && p.totalStock <= 10);
  const outOfStockProducts = products.filter((p) => p.totalStock === 0);
  const topSellingProducts = [...products].sort((a, b) => a.totalStock - b.totalStock).slice(0, 5);

  const orderStatusData = [
    { name: "Delivered", value: stats.deliveredOrders || 0 },
    { name: "Shipped", value: stats.shippedOrders || 0 },
    { name: "Processing", value: stats.processingOrders || 0 },
    { name: "Pending", value: stats.pendingOrders || 0 },
  ];

  const exportToCSV = () => {
    const headers = "Order ID,Customer,Phone,Address,Total,Status,Date\n";
    const rows = filteredOrders.map((o) => `${o._id.slice(-6)},${o.shippingInfo?.fullName},${o.shippingInfo?.phone},"${o.shippingInfo?.address}",${o.total},${o.status},${new Date(o.createdAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "nbl-stores-orders.csv"; a.click();
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Profile updated!");
    setAdminProfile({ ...adminProfile, currentPassword: "", newPassword: "" });
  };

  const getStatusClass = (status) => {
    switch (status) { case "Pending": return "status-pending"; case "Processing": return "status-processing"; case "Shipped": return "status-shipped"; case "Delivered": return "status-delivered"; default: return ""; }
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "stock-out";
    if (stock <= 5) return "stock-critical";
    if (stock <= 15) return "stock-low";
    return "stock-good";
  };

  // Customers from orders
  const customers = orders.reduce((acc, order) => {
    const name = order.shippingInfo?.fullName || order.user?.name || "Unknown";
    const email = order.user?.email || "N/A";
    const existing = acc.find((c) => c.email === email);
    if (existing) { existing.orders += 1; existing.totalSpent += order.total; }
    else { acc.push({ id: order._id, name, email, phone: order.shippingInfo?.phone || "N/A", orders: 1, totalSpent: order.total, joinDate: new Date(order.createdAt).toLocaleDateString() }); }
    return acc;
  }, []);

  const filteredCustomers = customers.filter((c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase()));

  // Real total revenue from all orders
  const totalRevenueAll = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const thisMonthRevenue = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, o) => sum + (o.total || 0), 0);

  // ==================== RENDER ====================
  return (
    <div className={`admin-panel ${darkMode ? "dark-mode" : ""}`}>
      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo font-[Playfair_Display]">NBL</span>
          <span className="sidebar-name font-[Inter]">Stores Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label font-[Inter]">MAIN</p>
          <button onClick={() => handleSidebarClick("dashboard")} className={`sidebar-item font-[Inter] ${activePage === "dashboard" ? "active-sidebar" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button onClick={() => handleSidebarClick("products")} className={`sidebar-item font-[Inter] ${activePage === "products" ? "active-sidebar" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Products
          </button>

          <p className="sidebar-section-label font-[Inter]">INVENTORY</p>
          <button onClick={() => handleSidebarClick("stock")} className={`sidebar-item font-[Inter] ${activePage === "stock" ? "active-sidebar" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Stock {lowStockProducts.length > 0 && <span className="sidebar-badge">{lowStockProducts.length}</span>}
          </button>
          <button onClick={() => handleSidebarClick("inventory")} className={`sidebar-item font-[Inter] ${activePage === "inventory" ? "active-sidebar" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Inventory
          </button>

          <p className="sidebar-section-label font-[Inter]">COMMERCE</p>
          <button onClick={() => handleSidebarClick("orders")} className={`sidebar-item font-[Inter] ${activePage === "orders" ? "active-sidebar" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Orders {stats.pendingOrders > 0 && <span className="sidebar-badge">{stats.pendingOrders}</span>}
          </button>
          <button onClick={() => handleSidebarClick("customers")} className={`sidebar-item font-[Inter] ${activePage === "customers" ? "active-sidebar" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            Customers
          </button>
          <button onClick={() => handleSidebarClick("coupons")} className={`sidebar-item font-[Inter] ${activePage === "coupons" ? "active-sidebar" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Coupons
          </button>

          <p className="sidebar-section-label font-[Inter]">SETTINGS</p>
          <button onClick={() => handleSidebarClick("settings")} className={`sidebar-item font-[Inter] ${activePage === "settings" ? "active-sidebar" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button onClick={handleLogout} className="sidebar-logout font-[Inter]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* ===== MAIN ===== */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button onClick={() => setSidebarOpen(true)} className="hamburger-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 className="topbar-title font-[Playfair_Display]">{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
          </div>
          <div className="topbar-right">
            <button onClick={() => setDarkMode(!darkMode)} className="topbar-icon-btn">
              {darkMode ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>}
            </button>
            <div className="notification-wrapper">
              <button onClick={() => setShowNotifications(!showNotifications)} className="topbar-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="notif-dropdown">
                  <div className="notif-header"><span className="font-[Inter]">Notifications</span><button onClick={markAllRead} className="mark-all-btn font-[Inter]">Mark all read</button></div>
                  {notifications.length === 0 ? <p className="empty-msg font-[Inter]" style={{ padding: "16px" }}>No notifications</p> : notifications.map((n) => (
                    <div key={n.id} onClick={() => markAsRead(n.id)} className={`notif-item ${!n.read ? "notif-unread" : ""}`}>
                      <p className="notif-text font-[Inter]">{n.text}</p>
                      <span className="notif-time font-[Inter]">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="admin-avatar font-[Inter]">A</div>
          </div>
        </header>

        {/* ===== DASHBOARD ===== */}
        {activePage === "dashboard" && (
          <div className="page-content">
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon-box revenue-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div><div><p className="stat-label font-[Inter]">Total Revenue</p><p className="stat-number font-[Inter]">Rs. {totalRevenueAll.toLocaleString()}</p><p className="stat-change positive font-[Inter]">Rs. {thisMonthRevenue.toLocaleString()} this month</p></div></div>
              <div className="stat-card"><div className="stat-icon-box orders-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg></div><div><p className="stat-label font-[Inter]">Total Orders</p><p className="stat-number font-[Inter]">{orders.length}</p><p className="stat-change positive font-[Inter]">{stats.pendingOrders || 0} pending</p></div></div>
              <div className="stat-card"><div className="stat-icon-box products-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg></div><div><p className="stat-label font-[Inter]">Total Stock</p><p className="stat-number font-[Inter]">{inventoryStats.totalStock}</p><p className="stat-change positive font-[Inter]">{products.length} products</p></div></div>
              <div className="stat-card"><div className="stat-icon-box customers-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div><p className="stat-label font-[Inter]">Customers</p><p className="stat-number font-[Inter]">{customers.length}</p><p className="stat-change positive font-[Inter]">{coupons.length} active coupons</p></div></div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3 className="chart-title font-[Inter]">Revenue Overview</h3>
                <p className="chart-subtitle font-[Inter]">Monthly revenue from delivered orders ({new Date().getFullYear()})</p>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#f0f0f0"} />
                    <XAxis dataKey="month" stroke={darkMode ? "#888" : "#9ca3af"} fontSize={12} />
                    <YAxis stroke={darkMode ? "#888" : "#9ca3af"} fontSize={12} />
                    <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                    <Line type="monotone" dataKey="revenue" stroke={darkMode ? "#fff" : "#111"} strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3 className="chart-title font-[Inter]">Weekly Orders</h3>
                <p className="chart-subtitle font-[Inter]">Orders in the last 7 days</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={weeklyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#f0f0f0"} />
                    <XAxis dataKey="day" stroke={darkMode ? "#888" : "#9ca3af"} fontSize={12} />
                    <YAxis stroke={darkMode ? "#888" : "#9ca3af"} fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="orders" fill={darkMode ? "#fff" : "#111"} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bottom-grid">
              <div className="info-card"><h3 className="card-title font-[Inter]">Top Products</h3><div className="top-selling-list">{topSellingProducts.length === 0 ? <p className="empty-msg font-[Inter]">No products</p> : topSellingProducts.map((p, i) => (<div key={p._id} className="top-selling-item"><div className="top-rank font-[Inter]">#{i + 1}</div><div className="top-info"><p className="top-name font-[Inter]">{p.title}</p><p className="top-meta font-[Inter]">{p.sku} — Stock: {p.totalStock}</p></div></div>))}</div></div>
              <div className="info-card"><h3 className="card-title font-[Inter]">Order Status</h3>{orders.length > 0 ? (<><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">{orderStatusData.map((e, i) => (<Cell key={i} fill={PIE_COLORS[i]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="pie-legend">{orderStatusData.map((e, i) => (<div key={i} className="pie-legend-item"><span className="pie-dot" style={{ backgroundColor: PIE_COLORS[i] }}></span><span className="font-[Inter]">{e.name} ({e.value})</span></div>))}</div></>) : <p className="empty-msg font-[Inter]">No orders</p>}</div>
              <div className="info-card"><h3 className="card-title font-[Inter]">Low Stock Alert</h3><div className="low-stock-list">{lowStockProducts.length === 0 ? <p className="empty-msg font-[Inter]">All stocked</p> : lowStockProducts.map((p) => (<div key={p._id} className="low-stock-item"><div><p className="low-stock-name font-[Inter]">{p.title}</p><p className="low-stock-cat font-[Inter]">{p.sku}</p></div><span className="low-stock-count font-[Inter]">{p.totalStock} left</span></div>))}</div></div>
            </div>
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {activePage === "products" && (
          <div className="page-content">
            <div className="page-toolbar"><input type="text" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products..." className="search-input font-[Inter]" /></div>

            <div className="form-card">
              <h3 className="card-title font-[Inter]">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="product-form">
                <div className="form-row">
                  <div className="form-group"><label className="form-label font-[Inter]">SKU</label><input type="text" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} placeholder="e.g. NBL-MEN-001" className="form-input font-[Inter]" required /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">Title</label><input type="text" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} placeholder="Product title" className="form-input font-[Inter]" required /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">Price (Rs.)</label><input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Price" className="form-input font-[Inter]" required /></div>
                </div>
                <div className="form-group"><label className="form-label font-[Inter]">Description</label><textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description" className="form-textarea font-[Inter]" rows="3" required></textarea></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label font-[Inter]">Image</label><input type="file" accept="image/*" onChange={(e) => setProductImage(e.target.files[0])} className="form-input font-[Inter]" required /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">Category</label><select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="form-input font-[Inter]"><option value="Men">Men</option><option value="Women">Women</option><option value="Kids">Kids</option></select></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label font-[Inter]">S Stock</label><input type="number" value={newProduct.sizeS} onChange={(e) => setNewProduct({ ...newProduct, sizeS: e.target.value })} className="form-input font-[Inter]" min="0" /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">M Stock</label><input type="number" value={newProduct.sizeM} onChange={(e) => setNewProduct({ ...newProduct, sizeM: e.target.value })} className="form-input font-[Inter]" min="0" /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">L Stock</label><input type="number" value={newProduct.sizeL} onChange={(e) => setNewProduct({ ...newProduct, sizeL: e.target.value })} className="form-input font-[Inter]" min="0" /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">XL Stock</label><input type="number" value={newProduct.sizeXL} onChange={(e) => setNewProduct({ ...newProduct, sizeXL: e.target.value })} className="form-input font-[Inter]" min="0" /></div>
                </div>
                {productImage && <p className="font-[Inter]" style={{ fontSize: "0.8rem", color: "#6b7280" }}>Selected: {productImage.name}</p>}
                <button type="submit" className="primary-btn font-[Inter]" disabled={addingProduct}>{addingProduct ? "Uploading..." : "+ Add Product"}</button>
              </form>
            </div>

            <div className="list-card">
              <h3 className="card-title font-[Inter]">All Products ({filteredProducts.length})</h3>
              {loadingProducts ? <p className="empty-msg font-[Inter]">Loading...</p> : filteredProducts.length === 0 ? <p className="empty-msg font-[Inter]">No products found.</p> : (
                <div className="admin-list">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="admin-list-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
                      {editingProduct === product._id ? (
                        <div className="edit-product-form">
                          <div className="form-row">
                            <div className="form-group"><label className="form-label font-[Inter]">Title</label><input type="text" value={editProduct.title} onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })} className="form-input font-[Inter]" /></div>
                            <div className="form-group"><label className="form-label font-[Inter]">Price</label><input type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} className="form-input font-[Inter]" /></div>
                            <div className="form-group"><label className="form-label font-[Inter]">Category</label><select value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} className="form-input font-[Inter]"><option value="Men">Men</option><option value="Women">Women</option><option value="Kids">Kids</option></select></div>
                          </div>
                          <div className="form-group"><label className="form-label font-[Inter]">Description</label><textarea value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} className="form-textarea font-[Inter]" rows="2"></textarea></div>
                          <div className="form-row">
                            <div className="form-group"><label className="form-label font-[Inter]">S</label><input type="number" value={editProduct.sizeS} onChange={(e) => setEditProduct({ ...editProduct, sizeS: e.target.value })} className="form-input font-[Inter]" min="0" /></div>
                            <div className="form-group"><label className="form-label font-[Inter]">M</label><input type="number" value={editProduct.sizeM} onChange={(e) => setEditProduct({ ...editProduct, sizeM: e.target.value })} className="form-input font-[Inter]" min="0" /></div>
                            <div className="form-group"><label className="form-label font-[Inter]">L</label><input type="number" value={editProduct.sizeL} onChange={(e) => setEditProduct({ ...editProduct, sizeL: e.target.value })} className="form-input font-[Inter]" min="0" /></div>
                            <div className="form-group"><label className="form-label font-[Inter]">XL</label><input type="number" value={editProduct.sizeXL} onChange={(e) => setEditProduct({ ...editProduct, sizeXL: e.target.value })} className="form-input font-[Inter]" min="0" /></div>
                          </div>
                          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                            <button onClick={() => saveEditProduct(product._id)} className="primary-btn font-[Inter]" style={{ padding: "8px 20px", fontSize: "0.8rem" }}>Save</button>
                            <button onClick={cancelEditProduct} className="delete-btn font-[Inter]">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <img src={product.image} alt={product.title} className="list-item-img" />
                          <div className="list-item-info">
                            <h4 className="list-item-title font-[Inter]">{product.title}</h4>
                            <p className="list-item-meta font-[Inter]">{product.sku} — {product.category} — Rs. {product.price} — Stock: {product.totalStock}</p>
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                            <button onClick={() => startEditProduct(product)} className="primary-btn font-[Inter]" style={{ padding: "6px 16px", fontSize: "0.78rem" }}>Edit</button>
                            <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn font-[Inter]">Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== STOCK ===== */}
        {activePage === "stock" && (
          <div className="page-content">
            <div className="page-toolbar">
              <h2 className="font-[Inter]" style={{ fontSize: "1rem", fontWeight: 600, color: darkMode ? "#fff" : "#111" }}>Manage Stock by Size</h2>
              <div className="toolbar-actions">
                <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="filter-select font-[Inter]"><option value="all">All Products</option><option value="out">Out of Stock</option><option value="low">Low Stock</option><option value="in">In Stock (10+)</option></select>
              </div>
            </div>
            <div className="list-card">
              {stockFilteredProducts.length === 0 ? <p className="empty-msg font-[Inter]">No products found.</p> : (
                <div className="admin-list">{stockFilteredProducts.map((product) => (
                  <div key={product._id} className="admin-list-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                      <img src={product.image} alt={product.title} className="list-item-img" />
                      <div className="list-item-info"><h4 className="list-item-title font-[Inter]">{product.title}</h4><p className="list-item-meta font-[Inter]">{product.sku} — Total: {product.totalStock}</p></div>
                      {editingStock === product._id ? (
                        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                          <button onClick={() => saveStock(product._id)} className="primary-btn font-[Inter]" style={{ padding: "6px 16px", fontSize: "0.78rem" }}>Save</button>
                          <button onClick={cancelEditStock} className="delete-btn font-[Inter]">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => startEditStock(product)} className="primary-btn font-[Inter]" style={{ padding: "6px 16px", fontSize: "0.78rem", flexShrink: 0 }}>Edit Stock</button>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {(editingStock === product._id ? editSizes : product.sizes).map((s, i) => (
                        <div key={s.size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "10px 16px", borderRadius: "8px", border: "1px solid", borderColor: darkMode ? "#333" : "#e5e7eb", minWidth: "70px" }}>
                          <span className="font-[Inter]" style={{ fontSize: "0.8rem", fontWeight: 600, color: darkMode ? "#fff" : "#111" }}>{s.size}</span>
                          {editingStock === product._id ? (
                            <input type="number" value={editSizes[i]?.stock || 0} onChange={(e) => updateSizeStock(i, e.target.value)} className="form-input font-[Inter]" style={{ width: "60px", padding: "4px", textAlign: "center", fontSize: "0.85rem" }} min="0" />
                          ) : (
                            <span className={`font-[Inter] ${getStockColor(s.stock)}`} style={{ fontSize: "0.9rem", fontWeight: 700 }}>{s.stock}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
          </div>
        )}

        {/* ===== INVENTORY ===== */}
        {activePage === "inventory" && (
          <div className="page-content">
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon-box products-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg></div><div><p className="stat-label font-[Inter]">Total Products</p><p className="stat-number font-[Inter]">{inventoryStats.totalProducts}</p></div></div>
              <div className="stat-card"><div className="stat-icon-box revenue-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg></div><div><p className="stat-label font-[Inter]">Total Stock</p><p className="stat-number font-[Inter]">{inventoryStats.totalStock}</p></div></div>
              <div className="stat-card"><div className="stat-icon-box orders-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div><p className="stat-label font-[Inter]">Low Stock</p><p className="stat-number font-[Inter]">{inventoryStats.lowStockCount}</p></div></div>
              <div className="stat-card"><div className="stat-icon-box customers-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div><div><p className="stat-label font-[Inter]">Out of Stock</p><p className="stat-number font-[Inter]">{inventoryStats.outOfStockCount}</p></div></div>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <h3 className="chart-title font-[Inter]">Stock by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { category: "Men", stock: inventoryStats.categoryStock?.Men || 0 },
                    { category: "Women", stock: inventoryStats.categoryStock?.Women || 0 },
                    { category: "Kids", stock: inventoryStats.categoryStock?.Kids || 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#f0f0f0"} />
                    <XAxis dataKey="category" stroke={darkMode ? "#888" : "#9ca3af"} fontSize={12} />
                    <YAxis stroke={darkMode ? "#888" : "#9ca3af"} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="stock" fill={darkMode ? "#fff" : "#111"} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="info-card">
                <h3 className="card-title font-[Inter]">Out of Stock Products</h3>
                <div className="low-stock-list">
                  {outOfStockProducts.length === 0 ? <p className="empty-msg font-[Inter]">All in stock!</p> : outOfStockProducts.map((p) => (
                    <div key={p._id} className="low-stock-item"><div><p className="low-stock-name font-[Inter]">{p.title}</p><p className="low-stock-cat font-[Inter]">{p.sku} — {p.category}</p></div><span className="low-stock-count font-[Inter]" style={{ color: "#ef4444" }}>0 left</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {activePage === "orders" && (
          <div className="page-content">
            <div className="page-toolbar">
              <input type="text" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search orders..." className="search-input font-[Inter]" />
              <div className="toolbar-actions">
                <select value={orderDateFilter} onChange={(e) => setOrderDateFilter(e.target.value)} className="filter-select font-[Inter]"><option value="all">All Time</option><option value="today">Today</option><option value="week">This Week</option><option value="month">This Month</option></select>
                <button onClick={exportToCSV} className="export-btn font-[Inter]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export CSV</button>
              </div>
            </div>
            <div className="orders-list">
              {loadingOrders ? <p className="empty-msg font-[Inter]">Loading...</p> : filteredOrders.length === 0 ? <p className="empty-msg font-[Inter]">No orders found.</p> : filteredOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header"><div><p className="order-id font-[Inter]">Order #{order._id.slice(-6)}</p><p className="order-date font-[Inter]">{new Date(order.createdAt).toLocaleDateString()}</p></div><select value={order.status} onChange={(e) => changeOrderStatus(order._id, e.target.value)} className={`status-select font-[Inter] ${getStatusClass(order.status)}`}>
  <option value="Pending">Pending</option>
  <option value="Processing">Processing</option>
  <option value="Shipped">Shipped</option>
  <option value="Delivered">Delivered</option>
  <option value="Cancelled">Cancelled</option>
</select></div>
                  <div className="order-customer"><p className="font-[Inter]"><strong>Customer:</strong> {order.shippingInfo?.fullName}</p><p className="font-[Inter]"><strong>Phone:</strong> {order.shippingInfo?.phone}</p><p className="font-[Inter]"><strong>Address:</strong> {order.shippingInfo?.address}, {order.shippingInfo?.city}</p></div>
                  <div className="order-items">{order.items.map((item, i) => (<div key={i} className="order-item-row"><span className="font-[Inter]">{item.title} ({item.size}) × {item.quantity}</span><span className="font-[Inter]">Rs. {item.price * item.quantity}</span></div>))}</div>
                  <div className="order-total"><span className="font-[Inter]">Total</span><span className="order-total-price font-[Inter]">Rs. {order.total}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CUSTOMERS ===== */}
        {activePage === "customers" && (
          <div className="page-content">
            <div className="page-toolbar"><input type="text" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="Search customers..." className="search-input font-[Inter]" /></div>
            <div className="list-card">
              <h3 className="card-title font-[Inter]">All Customers ({filteredCustomers.length})</h3>
              {filteredCustomers.length === 0 ? <p className="empty-msg font-[Inter]">No customers.</p> : (
                <div className="customers-table">
                  <div className="table-header"><span className="font-[Inter]">Name</span><span className="font-[Inter]">Email</span><span className="font-[Inter]">Phone</span><span className="font-[Inter]">Orders</span><span className="font-[Inter]">Total Spent</span><span className="font-[Inter]">First Order</span></div>
                  {filteredCustomers.map((c) => (<div key={c.id} className="table-row"><span className="customer-name font-[Inter]">{c.name}</span><span className="font-[Inter]">{c.email}</span><span className="font-[Inter]">{c.phone}</span><span className="font-[Inter]">{c.orders}</span><span className="font-[Inter]">Rs. {c.totalSpent.toLocaleString()}</span><span className="font-[Inter]">{c.joinDate}</span></div>))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== COUPONS ===== */}
        {activePage === "coupons" && (
          <div className="page-content">
            <div className="form-card">
              <h3 className="card-title font-[Inter]">Create Coupon</h3>
              <form onSubmit={handleAddCoupon} className="product-form">
                <div className="form-row">
                  <div className="form-group"><label className="form-label font-[Inter]">Code</label><input type="text" value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20" className="form-input font-[Inter]" required /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">Discount %</label><input type="number" value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })} placeholder="e.g. 20" className="form-input font-[Inter]" min="1" max="100" required /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">Min Order (Rs.)</label><input type="number" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })} placeholder="0" className="form-input font-[Inter]" min="0" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label font-[Inter]">Max Uses</label><input type="number" value={newCoupon.maxUses} onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })} placeholder="100" className="form-input font-[Inter]" min="1" /></div>
                  <div className="form-group"><label className="form-label font-[Inter]">Expires At</label><input type="date" value={newCoupon.expiresAt} onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })} className="form-input font-[Inter]" required /></div>
                </div>
                <button type="submit" className="primary-btn font-[Inter]">+ Create Coupon</button>
              </form>
            </div>
            <div className="list-card">
              <h3 className="card-title font-[Inter]">All Coupons ({coupons.length})</h3>
              {coupons.length === 0 ? <p className="empty-msg font-[Inter]">No coupons yet.</p> : (
                <div className="admin-list">
                  {coupons.map((coupon) => (
                    <div key={coupon._id} className="admin-list-item">
                      <div className="list-item-info">
                        <h4 className="list-item-title font-[Inter]" style={{ letterSpacing: "2px" }}>{coupon.code}</h4>
                        <p className="list-item-meta font-[Inter]">
                          {coupon.discount}% off — Min Rs. {coupon.minOrder} — Used {coupon.usedCount}/{coupon.maxUses} — Expires {new Date(coupon.expiresAt).toLocaleDateString()}
                          {new Date() > new Date(coupon.expiresAt) && <span style={{ color: "#ef4444", marginLeft: "8px" }}>EXPIRED</span>}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteCoupon(coupon._id)} className="delete-btn font-[Inter]">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {activePage === "settings" && (
          <div className="page-content">
            <div className="form-card"><h3 className="card-title font-[Inter]">Appearance</h3><div className="theme-toggle-section"><div><p className="setting-label font-[Inter]">Dark Mode</p><p className="setting-desc font-[Inter]">Switch theme</p></div><button onClick={() => setDarkMode(!darkMode)} className={`toggle-switch ${darkMode ? "toggle-on" : ""}`}><span className="toggle-knob"></span></button></div></div>
            <div className="form-card"><h3 className="card-title font-[Inter]">Profile</h3><form onSubmit={handleSaveProfile} className="settings-form"><div className="form-row"><div className="form-group"><label className="form-label font-[Inter]">Name</label><input type="text" value={adminProfile.name} onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })} className="form-input font-[Inter]" /></div><div className="form-group"><label className="form-label font-[Inter]">Email</label><input type="email" value={adminProfile.email} onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })} className="form-input font-[Inter]" /></div></div><div className="form-row"><div className="form-group"><label className="form-label font-[Inter]">Current Password</label><input type="password" value={adminProfile.currentPassword} onChange={(e) => setAdminProfile({ ...adminProfile, currentPassword: e.target.value })} placeholder="Current password" className="form-input font-[Inter]" /></div><div className="form-group"><label className="form-label font-[Inter]">New Password</label><input type="password" value={adminProfile.newPassword} onChange={(e) => setAdminProfile({ ...adminProfile, newPassword: e.target.value })} placeholder="New password" className="form-input font-[Inter]" /></div></div><button type="submit" className="primary-btn font-[Inter]">Save Changes</button></form></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;