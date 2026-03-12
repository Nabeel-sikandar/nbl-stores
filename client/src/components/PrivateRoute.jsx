// PrivateRoute — login required, redirect to signin
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!isLoggedIn) return <Navigate to="/signin" replace />;

  return children;
};

export default PrivateRoute;