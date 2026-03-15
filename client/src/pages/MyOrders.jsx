// My Orders — User order tracking + Cancel order
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductsNavbar from "../components/ProductsNavbar";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../components/Toast";
import API from "../api/axios";
import "./MyOrders.css";

const MyOrders = () => {
  const { darkMode } = useTheme();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Fetch Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map((o) => o._id === orderId ? { ...o, status: "Cancelled" } : o));
      showToast("Order cancelled successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.msg || "Failed to cancel order", "error");
    }
  };

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "status-pending";
      case "Processing": return "status-processing";
      case "Shipped": return "status-shipped";
      case "Delivered": return "status-delivered";
      case "Cancelled": return "status-cancelled";
      default: return "";
    }
  };

  const getStepNumber = (status) => {
    switch (status) {
      case "Pending": return 1;
      case "Processing": return 2;
      case "Shipped": return 3;
      case "Delivered": return 4;
      default: return 0;
    }
  };

  return (
    <div className={`myorders-page ${darkMode ? "myorders-dark" : ""}`}>
      <ProductsNavbar />

      <div className="myorders-content">
        <div className="myorders-header">
          <h1 className="myorders-title font-[Playfair_Display]">My Orders</h1>
          <p className="myorders-subtitle font-[Inter]">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="order-filter-tabs">
          {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`order-filter-tab font-[Inter] ${filter === f ? "filter-active" : ""}`}
            >
              {f === "all" ? "All Orders" : f}
              {f !== "all" && (
                <span className="filter-count">
                  {orders.filter((o) => o.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h2 className="empty-title font-[Playfair_Display]">No orders found</h2>
            <p className="empty-text font-[Inter]">
              {filter === "all" ? "You haven't placed any orders yet." : `No ${filter.toLowerCase()} orders.`}
            </p>
            <Link to="/products" className="empty-btn font-[Inter]">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const step = getStepNumber(order.status);
              return (
                <div key={order._id} className="order-card">
                  {/* Order Header */}
                  <div className="order-card-header">
                    <div>
                      <p className="order-id font-[Inter]">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="order-date font-[Inter]">{new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <span className={`order-status-badge font-[Inter] ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Progress Tracker */}
                  {order.status !== "Cancelled" && (
                    <div className="progress-tracker">
                      <div className="progress-line">
                        <div className="progress-fill" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                      </div>
                      <div className="progress-steps">
                        {["Pending", "Processing", "Shipped", "Delivered"].map((s, i) => (
                          <div key={s} className={`progress-step ${i + 1 <= step ? "step-active" : ""}`}>
                            <div className="step-dot">
                              {i + 1 < step ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                              ) : (
                                <span>{i + 1}</span>
                              )}
                            </div>
                            <span className="step-label font-[Inter]">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cancelled Banner */}
                  {order.status === "Cancelled" && (
                    <div className="cancelled-banner">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      <p className="font-[Inter]">This order has been cancelled</p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="order-items-list">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item">
                        <img src={item.image} alt={item.title} className="order-item-img" />
                        <div className="order-item-info">
                          <p className="order-item-title font-[Inter]">{item.title}</p>
                          <p className="order-item-meta font-[Inter]">Size: {item.size} × {item.quantity}</p>
                        </div>
                        <p className="order-item-price font-[Inter]">Rs. {item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="order-card-footer">
                    <div className="order-shipping-info">
                      <p className="font-[Inter]"><strong>Ship to:</strong> {order.shippingInfo?.fullName}</p>
                      <p className="font-[Inter]">{order.shippingInfo?.address}, {order.shippingInfo?.city}</p>
                    </div>
                    <div className="order-footer-right">
                      <div className="order-total-info">
                        <p className="order-total-label font-[Inter]">Total</p>
                        <p className="order-total-value font-[Inter]">Rs. {order.total?.toLocaleString()}</p>
                        <p className="order-payment font-[Inter]">{order.paymentMethod}</p>
                      </div>
                      {(order.status === "Pending" || order.status === "Processing") && (
                        <button onClick={() => handleCancelOrder(order._id)} className="cancel-order-btn font-[Inter]">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default MyOrders;