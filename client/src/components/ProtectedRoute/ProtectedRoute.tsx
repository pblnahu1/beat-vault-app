// codigo para rutas protegidas

import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/api/auth" replace />;
  }

  return <Outlet />;
}
