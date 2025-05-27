import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import cartService from '../services/cartService';
import AuthService from '../services/authService';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  // isOnline: boolean;
  total: number;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  loadCart: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      // isOnline: true,
      total: 0,

      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),

      addItem: async (product) => {
        set({ isLoading: true, error: null });
        
        try {
          // Verificar conectividad
          // const isOnline = await cartService.checkConnection();
          // set({ isOnline });

          // if (isOnline) {
            // agregar al backend primero
            const getCurrentUserId = (): number | null => {
              const currentUser = AuthService.getCurrentUser();
              return currentUser ? currentUser.id_u : null;
            }
            const userId = getCurrentUserId();
            const response = await cartService.addToCart(product.id_p, 1, userId || 0);
            
            if (!response.success) {
              throw new Error(response.message || 'Failed to add item to cart');
            }
          // }

          // actualiza estado local
          const items = get().items;
          const existingItem = items.find((item) => item.id_p === product.id_p);

          let newItems;
          if (existingItem) {
            newItems = items.map((item) =>
              item.id_p === product.id_p
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newItems = [...items, { ...product, quantity: 1 }];
          }

          set({
            items: newItems as CartItem[],
            total: calculateTotal(newItems as CartItem[]),
            isLoading: false
          });

        } catch (error) {
          console.error('Error adding item:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add item',
            isLoading: false 
          });
          
          // si falla el backend, agregar solo localmente
          const items = get().items;
          const existingItem = items.find((item) => item.id_p === product.id_p);

          let newItems;
          if (existingItem) {
            newItems = items.map((item) =>
              item.id_p === product.id_p
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newItems = [...items, { ...product, quantity: 1 }];
          }

          set({
            items: newItems as CartItem[],
            total: calculateTotal(newItems as CartItem[])
          });
        }
      },

      removeItem: async (productId) => {
        set({ isLoading: true, error: null });
        
        try {
          // const isOnline = await cartService.checkConnection();
          // set({ isOnline });

          // if (isOnline) {
            const response = await cartService.removeFromCart(productId);
            if (!response.success) {
              throw new Error(response.message || 'Failed to remove item');
            }
          // }

          const currentItems = get().items;
          const newItems = currentItems.filter((item) => item.id_p !== productId);
          
          set({
            items: newItems,
            total: calculateTotal(newItems),
            isLoading: false
          });

        } catch (error) {
          console.error('Error removing item:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove item',
            isLoading: false 
          });
          
          // elimina localmente si falla el backend
          const currentItems = get().items;
          const newItems = currentItems.filter((item) => item.id_p !== productId);
          
          set({
            items: newItems,
            total: calculateTotal(newItems)
          });
        }
      },

      updateQuantity: async (productId, quantity) => {
        set({ isLoading: true, error: null });
        
        try {
          // const isOnline = await cartService.checkConnection();
          // set({ isOnline });

          // if (isOnline) {
            if (quantity === 0) {
              const response = await cartService.removeFromCart(productId);
              if (!response.success) {
                throw new Error(response.message || 'Failed to remove item');
              }
            } else {
              const response = await cartService.updateCartItem(productId, quantity);
              if (!response.success) {
                throw new Error(response.message || 'Failed to update quantity');
              }
            }
          // }

          const currentItems = get().items;
          let newItems;
          
          if (quantity === 0) {
            newItems = currentItems.filter((item) => item.id_p !== productId);
          } else {
            newItems = currentItems.map((item) =>
              item.id_p === productId ? { ...item, quantity } : item
            );
          }

          set({
            items: newItems,
            total: calculateTotal(newItems),
            isLoading: false
          });

        } catch (error) {
          console.error('Error updating quantity:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            isLoading: false 
          });
          
          // actualizar localmente si falla el backend
          const currentItems = get().items;
          let newItems;
          
          if (quantity === 0) {
            newItems = currentItems.filter((item) => item.id_p !== productId);
          } else {
            newItems = currentItems.map((item) =>
              item.id_p === productId ? { ...item, quantity } : item
            );
          }

          set({
            items: newItems,
            total: calculateTotal(newItems)
          });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // const isOnline = await cartService.checkConnection();
          // set({ isOnline });

          // if (isOnline) {
            const response = await cartService.clearCart();
            if (!response.success) {
              throw new Error(response.message || 'Failed to clear cart');
            }
          // }

          set({ 
            items: [], 
            total: 0, 
            isLoading: false 
          });

        } catch (error) {
          console.error('Error clearing cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            isLoading: false 
          });
          
          // limpiar localmente si falla el backend
          set({ items: [], total: 0 });
        }
      },

      loadCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // const isOnline = await cartService.checkConnection();
          // set({ isOnline });

          // if (isOnline) {
            const response = await cartService.getCart();
            
            if (response.success && response.data) {
              const items = response.data;
              set({
                items,
                total: calculateTotal(items),
                isLoading: false
              });
            } else {
              throw new Error(response.message || 'Failed to load cart');
            }
          // } else {
            // Si no hay conexión, usar datos locales
            // set({ isLoading: false });
          // }

        } catch (error) {
          console.error('Error loading cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load cart',
            isLoading: false 
          });
        }
      },

      syncWithBackend: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const currentItems = get().items;
          
          const getCurrentUserId = (): number | null => {
            const currentUser = AuthService.getCurrentUser();
            return currentUser ? currentUser.id_u : null;
          }

          const userId = getCurrentUserId();
          
          // sincronizo cada item individualmente
          for (const item of currentItems) {
            const response = await cartService.addToCart(item.id_p, item.quantity, userId || 0);
            
            if (!response.success) {
              throw new Error(response.message || 'Failed to sync item');
            }
          }
          
          set({
            items: currentItems,
            total: calculateTotal(currentItems),
            isLoading: false
          });
          
        } catch (error) {
          console.error('Error syncing cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sync cart',
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'cart-storage',
      skipHydration: false,
    }
  )
);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price_p * item.quantity, 0);
};