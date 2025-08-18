import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/useCart";
import authService from "../services/authService";

export function useLogout() {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useState<boolean>(!!localStorage.getItem('authToken'));    

    useEffect(()=>{
        // escucha cambios en localstorage
        const onStorage = () => setIsLogged(!!localStorage.getItem('authToken'));
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    },[]);

    const handleLogout = () => {
        useCart.getState().resetCartLocal(); //limpio el carrito local (zustand)
        authService.logout(); // notifica al backend y limpia el localstorage
        setIsLogged(false); // actualizo estado local
        navigate("/api/auth", { replace: true }); //redirigir al login reemplazando el historial
    };    

    return {
        isLogged,
        handleLogout
    }
}