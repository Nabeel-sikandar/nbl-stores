// AuthContext — login/signup/logout + user state
import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Token decode karke check karo — admin hai ya user
          const payload = JSON.parse(atob(token.split(".")[1]));

          if (payload.role === "admin") {
            // Admin hai — profile fetch nahi karna, direct set karo
            setUser({ email: payload.email, role: "admin", name: "Admin" });
          } else {
            // Normal user — profile fetch karo
            const res = await API.get("/auth/profile");
            setUser(res.data.user);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const signup = async (name, email, password, confirmPassword) => {
    const res = await API.post("/auth/signup", { name, email, password, confirmPassword });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const signin = async (email, password) => {
    const res = await API.post("/auth/signin", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const adminSignin = async (email, password) => {
    const res = await API.post("/auth/admin/signin", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Google Login
const googleLogin = async (credential) => {
  const res = await API.post("/auth/google", { credential });
  localStorage.setItem("token", res.data.token);
  setToken(res.data.token);
  setUser(res.data.user);
  return res.data;
};

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
    user,
    token,
    loading,
    signup,
    signin,
    adminSignin,
    googleLogin,
    logout,
    isLoggedIn: !!token,
    isAdmin: user?.role === "admin",
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};