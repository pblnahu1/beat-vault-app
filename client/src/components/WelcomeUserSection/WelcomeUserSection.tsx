import { useEffect, useState } from 'react';
import authService from '../../services/authService';
// import { ButtonGestion } from '../UI/Buttons/ButtonGestionProps';

export const WelcomeUserSection = () => {

  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const username = currentUser?.username;

  useEffect(() => {
    const handleStorage = () => setCurrentUser(authService.getCurrentUser());
    window.addEventListener("storage", handleStorage);

    // actualizo al montar
    const interval = setInterval(() => {
      setCurrentUser(authService.getCurrentUser());
    }, 1500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    }
  }, []);

  if (!username) return null;

  return (
    <section
      className="w-full mx-auto rounded-2xl shadow-lg p-4 flex flex-col items-center text-center mb-10"
      style={{
        background: "linear-gradient(270deg, #1e1e2e, #312e81, #18181b)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 8s ease infinite",
        border: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <h2 className="text-xl font-semibold text-slate-200">
        ¡Hola, {username}!
      </h2>
      <style>
        {`
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}
      </style>
    </section>


  )
}
