// codigo para rutas protegidas

import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/dashboard-auth" replace />;
  }

  return <Outlet />;
}
