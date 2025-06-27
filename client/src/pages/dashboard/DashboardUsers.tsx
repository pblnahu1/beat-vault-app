// src/pages/dashboard/DashboardLayout.tsx
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import authService from "../../services/authService";
import { useCart } from "../../store/useCart";

export default function DashboardLayout() {

  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const prevUserRef = useRef(currentUser?.id_u);
  const username = currentUser?.username;

  useEffect(()=>{
    const handleStorage = () => setCurrentUser(authService.getCurrentUser());
    window.addEventListener("storage", handleStorage);

    // actualiza al montar (por si se cerró sesión en esa pestaña)
    const interval = setInterval(() => {
      setCurrentUser(authService.getCurrentUser());
    }, 1500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    }
  },[]);

  // Sincroniza el carrito cuando cambia el usuario
  useEffect(() => {
    if (currentUser?.id_u && prevUserRef.current !== currentUser.id_u) {
      useCart.getState().loadCart(); // o la función que corresponda para cargar el carrito
      prevUserRef.current = currentUser.id_u;
    }
    // Si no hay usuario, podrías limpiar el carrito:
    if (!currentUser) {
      useCart.getState().clearCart();
      prevUserRef.current = undefined;
    }
  }, [currentUser]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white text-black p-4">
        <h2 className="text-2xl font-bold mb-6">Hola, {username}</h2>
        <nav className="flex flex-col space-y-2">
          <Link to={`/dashboard/${username}/profile`}>Perfil</Link>
          <Link to={`/dashboard/${username}/orders`}>Historial de Compras</Link>
          <Link to={`/dashboard/${username}/wish-list`}>Lista de Deseos</Link>
          <Link to={`/dashboard/${username}/addresses`}>Direcciones</Link>
          <Link to={`/dashboard/${username}/payments`}>Métodos de Pago</Link>
          <Link to={`/dashboard/${username}/reviews`}>Reseñas</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
