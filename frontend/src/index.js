import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Video from "./Components/Video";
import Login from "./Components/Login";
import Register from "./Components/Register";
import NotFound from "./Components/NotFound";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthProvider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <NotFound />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Video />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
]);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
