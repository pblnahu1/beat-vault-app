import { useEffect, useState } from 'react';
import authService from '../services/authService';

export const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

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

    return {
        currentUser,
        username: currentUser?.username,
        isAuthenticated: !!currentUser
    }
}