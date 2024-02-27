import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (localStorage.getItem("user") !== undefined) {
    return children;
  }
  localStorage.setItem("user", auth.email);

  return !auth.isAuthenticated ? <Navigate to="/login" /> : children;
};

export default ProtectedRoute;
