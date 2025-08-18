import { useLogout } from "../../../../hooks/useLogout";

export function LogoutButton() {
  const {isLogged, handleLogout} = useLogout();
  if(!isLogged) return null;

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-3xl"
    >
      Cerrar Sesión
    </button>
  );
}
