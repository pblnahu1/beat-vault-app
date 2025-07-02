import React from "react";
import { useLogin } from "../../../hooks/useLogin";

export default function Login(): JSX.Element {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isSubmitDisabled,
    errorMessage,
    handleTogglePassword,
    handleSubmit
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-8 rounded-2xl shadow-2xl bg-zinc-900/90 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-slate-100 text-center">Iniciar Sesión</h2>
        
        {errorMessage && (
          <div className="my-4 p-3 bg-red-900/30 border border-red-800 text-red-400 rounded text-sm text-center">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              className="w-full bg-zinc-800 border border-zinc-700 text-slate-100 p-3 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                className="w-full bg-zinc-800 border border-zinc-700 text-slate-100 p-3 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none transition pr-10"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-400 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  // Ojo abierto
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  // Ojo cerrado
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.634 6.634A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.507 5.294M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full p-3 rounded font-semibold transition-colors ${
              isSubmitDisabled 
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isSubmitDisabled}
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div className="text-center mt-6 text-sm text-slate-400">
          ¿No tienes una cuenta?{" "}
          <a href="/auth/create-account" className="text-blue-400 font-medium hover:underline">
            Regístrate
          </a>
        </div>
      </div>
    </div>
  );
}