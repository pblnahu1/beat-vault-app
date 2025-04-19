// codigo para rutas protegidas

import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/dashboard-auth" replace />;
  }

  return <Outlet />;
}
