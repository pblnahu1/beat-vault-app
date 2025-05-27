
import { useEffect } from 'react';
import { useCart } from '../store/useCart';

/**
 * Hook para inicializar el carrito al cargar la aplicación
 * Debe ser usado en el componente raíz (App.tsx)
 */
export const useCartInit = () => {
  const { loadCart, syncWithBackend } = useCart();

  useEffect(() => {
    const initializeCart = async () => {
      try {
        // cargar el carrito desde el backend
        await loadCart();

        // tiempo de espera
        setTimeout(() => {
          syncWithBackend();
        }, 1000);
    
      } catch (error) {
        console.error('Error initializing cart:', error);
      }
    };

    initializeCart();
  }, [loadCart, syncWithBackend]);

  // escuchar cambios en la conectividad
  useEffect(() => {
    const handleOnline = () => {
      console.log('Connection restored, syncing cart...');
      syncWithBackend();
    };

    const handleOffline = () => {
      console.log('Connection lost, using local storage only');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncWithBackend]);
};