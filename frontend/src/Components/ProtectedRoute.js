import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  console.log(localStorage.getItem("user"));
  if (localStorage.getItem("user") !== "undefined" && localStorage.getItem("user" !== null)) {
    console.log("if condifiton");
    return children;
  }
  localStorage.setItem("user", auth.email);

  return !auth.isAuthenticated ? <Navigate to="/login" /> : children;
};

export default ProtectedRoute;
