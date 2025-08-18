// src/hooks/useAuthState.ts
import { useEffect, useState, useRef } from "react";
import authService from "../services/authService";
import { useCart } from "../store/useCart";

export function useManagementUsers() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const prevUserRef = useRef(currentUser?.id_u);

  useEffect(() => {
    const handleStorage = () => setCurrentUser(authService.getCurrentUser());
    window.addEventListener("storage", handleStorage);

    // actualiza al montar (por si se cerró sesión en esa pestaña)
    const interval = setInterval(() => {
      setCurrentUser(authService.getCurrentUser());
    }, 1500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (currentUser?.id_u && prevUserRef.current !== currentUser.id_u) {
      useCart.getState().loadCart();
      prevUserRef.current = currentUser.id_u;
    }
    if (!currentUser) {
      useCart.getState().clearCart();
      prevUserRef.current = undefined;
    }
  }, [currentUser]);

  return currentUser;
}