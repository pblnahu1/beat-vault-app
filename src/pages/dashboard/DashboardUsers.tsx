// src/pages/dashboard/DashboardLayout.tsx
import { Link, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white text-black p-4">
        <h2 className="text-2xl font-bold mb-6">Mi Cuenta</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/dashboard/:username/profile">Perfil</Link>
          <Link to="/dashboard/:username/orders">Historial de Compras</Link>
          <Link to="/dashboard/:username/wish-list">Lista de Deseos</Link>
          <Link to="/dashboard/:username/addresses">Direcciones</Link>
          <Link to="/dashboard/:username/payments">Métodos de Pago</Link>
          <Link to="/dashboard/:username/reviews">Reseñas</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
