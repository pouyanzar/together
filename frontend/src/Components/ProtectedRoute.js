import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  return !auth.isAuthenticated ? <Navigate to="/login" /> : children;
};

export default ProtectedRoute;
