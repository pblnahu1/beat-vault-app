import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // 1. Borrar el token
    navigate("/dashboard-auth", { replace: true }); // 2. Redirigir reemplazando el historial
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
    >
      Cerrar Sesión
    </button>
  );
}
