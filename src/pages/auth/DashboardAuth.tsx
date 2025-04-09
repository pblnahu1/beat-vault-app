import { Link } from "react-router-dom";

export default function DashboardAuth() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
        ¡Crea tu cuenta y empezá a comprar con libertad!
      </h1>
      <p className="text-gray-600 mb-10 text-lg">
        Registrate o iniciá sesión para acceder a tu perfil, ver tus pedidos, guardar productos en tu lista de deseos, dejar reseñas y gestionar tus métodos de pago y direcciones.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/account/create-account"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Crear cuenta
        </Link>
        <Link
          to="/account/login"
          className="border border-black text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
