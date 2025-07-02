import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function DashboardAuth() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[1300px] h-[520px] md:h-[600px] mx-auto flex flex-col justify-center items-center text-center bg-gradient-to-br from-indigo-700 via-indigo-900 to-blue-950 rounded-3xl shadow-lg px-20">
        <UserPlus size={64} className="text-indigo-200 mb-4 drop-shadow-lg" />
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-50 uppercase">
          ¡Creá tu cuenta y empezá a comprar con libertad!
        </h1>
        <h2 className="text-lg md:text-2xl text-yellow-400 mb-6 font-medium">
          Descubrí una experiencia personalizada y segura en Fluxshop.
        </h2>
        <p className="text-gray-300 mb-10 text-lg">
          Registrate o iniciá sesión para acceder a tu perfil, ver tus pedidos, guardar productos en tu lista de deseos, dejar reseñas y gestionar tus métodos de pago y direcciones.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/auth/create-account"
            className="bg-blue-600 text-slate-50 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Crear cuenta
          </Link>
          <Link
            to="/auth/login"
            className="border border-slate-100 text-slate-50 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-50 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Iniciar sesión
          </Link>
        </div>
        <p className="text-xs text-gray-400 max-w-xs mx-auto my-5">
          Tu información está protegida y nunca será compartida con terceros. Compra seguro y gestioná tus datos con total confianza.
        </p>
      </div>
    </div>
  );
}
