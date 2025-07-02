import {useEffect, useState} from 'react';
import authService from '../../services/authService';
import { ButtonGestion } from '../UI/Buttons/ButtonGestionProps';

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
    },[]);

    if(!username) return null;

  return (
    <section className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-900 via-indigo-900 to-zinc-950 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50 mb-4">Hola, {username}</h2>
      <ButtonGestion username={username} />
    </section>
  )
}
