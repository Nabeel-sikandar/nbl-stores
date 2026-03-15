// Global Toast Notification — top-right position
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "i",
    warning: "!",
    cart: "🛒",
  };

  const colors = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#f59e0b",
    cart: "#111111",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container — TOP RIGHT */}
      <div style={{
        position: "fixed", top: "80px", right: "24px", zIndex: 99998,
        display: "flex", flexDirection: "column", gap: "10px",
        pointerEvents: "none",
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            display: "flex", alignItems: "center", gap: "12px",
            backgroundColor: "#111111", color: "#ffffff",
            padding: "14px 20px", borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            animation: "toastIn 0.4s ease forwards",
            pointerEvents: "auto", maxWidth: "360px", minWidth: "260px",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              backgroundColor: colors[toast.type], color: "#ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.85rem", fontWeight: 700, flexShrink: 0,
            }}>
              {icons[toast.type]}
            </div>
            <p style={{
              fontSize: "0.85rem", fontWeight: 500, color: "#ffffff",
              fontFamily: "Inter, sans-serif", flex: 1, margin: 0,
            }}>
              {toast.message}
            </p>
            <button onClick={() => removeToast(toast.id)} style={{
              background: "none", border: "none", color: "#6b7280",
              cursor: "pointer", fontSize: "0.9rem", padding: "2px",
            }}>✕</button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-16px) translateX(16px); }
          to { opacity: 1; transform: translateY(0) translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};