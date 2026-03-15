// Loading Screen — NBL logo animation on app load
import { useState, useEffect } from "react";

const LoadingScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeOut(true), 1800);
    setTimeout(() => onFinish(), 2200);
  }, [onFinish]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
      backgroundColor: "#111111", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: fadeOut ? 0 : 1, transition: "opacity 0.4s ease",
    }}>
      <div style={{ animation: "logoFadeIn 0.8s ease forwards" }}>
        <span style={{
          fontFamily: "Playfair Display, serif", fontSize: "3rem",
          fontWeight: 700, color: "#ffffff", letterSpacing: "8px",
        }}>NBL</span>
        <span style={{
          display: "block", fontFamily: "Inter, sans-serif", fontSize: "0.7rem",
          color: "#6b7280", letterSpacing: "6px", textAlign: "center", marginTop: "4px",
        }}>STORES</span>
      </div>
      <div style={{
        width: "60px", height: "2px", backgroundColor: "#333",
        borderRadius: "2px", marginTop: "24px", overflow: "hidden",
      }}>
        <div style={{
          width: "100%", height: "100%", backgroundColor: "#ffffff",
          animation: "loadingBar 1.5s ease forwards",
        }}></div>
      </div>

      <style>{`
        @keyframes logoFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loadingBar {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;