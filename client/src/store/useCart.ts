/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types/prodCart';
import cartService from '../services/cartService';
import AuthService from '../services/authService';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  total: number;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (cartId: number, productCartId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  loadCart: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  resetCartLocal: () => void;
}

const calculateTotal = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  return total;
};

const getCurrentUserId = (): number | null => {
  const currentUser = AuthService.getCurrentUser();
  return currentUser ? currentUser.id_u : null;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      total: 0,

      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      resetCartLocal: () => set({items: [], total: 0}),

      addItem: async (product) => {
        set({ isLoading: true, error: null });
        
        try {
          const userId = getCurrentUserId() || 0;
          const response = await cartService.addToCart(product.id, 1, userId);
          if (!response.success) throw new Error(response.message || 'Failed to add item to cart');

          // actualiza estado local
          const items = get().items;
          const existingItem = items.find((item) => item.id === product.id);
          let newItems;
          if (existingItem) {
            newItems = items.map((item) =>
              item.id === product.id
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
          console.log('Error to add item: ', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add item',
            isLoading: false 
          });
          
          // fallback local por si falla el backend, agregar solo localmente
          const items = get().items;
          const existingItem = items.find((item) => item.id === product.id);
          let newItems;
          if (existingItem) {
            newItems = items.map((item) =>
              item.id === product.id
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

      removeItem: async (productId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartService.removeFromCart(productId);
          if (!response.success) throw new Error(response.message || 'Failed to remove item');
          
          const currentItems = get().items;
          const newItems = currentItems.filter((item) => item.id !== productId);
          
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
          const newItems = currentItems.filter((item) => item.id !== productId);
          
          set({
            items: newItems,
            total: calculateTotal(newItems)
          });
        }
      },

      updateQuantity: async (cartId: number, productId: number, quantity: number) => {
        set({ isLoading: true, error: null });
        
        try {
          if (quantity === 0) {
            const response = await cartService.removeFromCart(productId);
            if (!response.success) throw new Error(response.message || 'Failed to remove item');
          } else {
            const response = await cartService.updateCartItem(cartId, productId, quantity);
            if (!response.success) throw new Error(response.message || 'Failed to update quantity');
          }

          const currentItems = get().items;
          let newItems;
          if (quantity === 0) {
            newItems = currentItems.filter((item) => item.id !== productId);
          } else {
            newItems = currentItems.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            );
          }

          set({
            items: newItems,
            total: calculateTotal(newItems),
            isLoading: false
          });

        } catch (error) {
          console.error('Error updated the cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            isLoading: false 
          });
          
          // actualizar localmente si falla el backend
          const currentItems = get().items;
          let newItems;
          
          if (quantity === 0) {
            newItems = currentItems.filter((item) => item.id !== productId);
          } else {
            newItems = currentItems.map((item) =>
              item.id === productId ? { ...item, quantity } : item
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
          const response = await cartService.clearCart();
          if (!response.success) throw new Error(response.message || 'Failed to clear cart');
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
          const token = localStorage.getItem('authToken');

          if(token){
            // solo cargar desde backend si hay token
            try {
              const response = await cartService.getCart();
              
              if (response.success && response.data) {
                const backendItems = response.data.data || response.data;
                console.log('Loaded cart from backend: ', backendItems);

                const mappedItems = backendItems.map((item: any) => ({
                  id: item.id_p,              // producto ID
                  id_cart: item.id_cart,      // cart item ID  
                  name: item.name_p,          // nombre producto
                  price: item.price_p || 0,   // precio (agregar si falta)
                  image: item.image_p || '',  // imagen (agregar si falta)
                  quantity: item.quantity,
                  id_u: item.id_u
                }));

                set({
                  items: mappedItems,
                  total: calculateTotal(mappedItems),
                  isLoading: false
                });
                
                return; // persist se encarga de guardarlo automáticamente
              }
            } catch (error) {
              console.error('Backend cart load failed:', error);
            }
          }

          // si no hay token o falló backend, persist ya tiene los datos locales
          set({ isLoading: false });
          
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
          const token = localStorage.getItem('authToken');
          if(!token){
            console.log('No auth token, skipping backend sync');
            set({isLoading: false});
            return;
          }

          const currentItems = get().items;
          // const getCurrentUserId = (): number | null => {
          //   try {
          //     const currentUser = AuthService.getCurrentUser();
          //     console.log('Current user from AuthService: ', currentUser);
          //     return currentUser ? currentUser.id_u : null;
          //   } catch(error){
          //     console.error('Error getting current user:',error);
          //     return null;
          //   }
          // }
          const userId = getCurrentUserId();
          if(!userId){
            console.log('No user ID found for sync');
            set({isLoading: false, error: 'user not found'});
            return;
          }

          console.log('syncing cart with backend: ', currentItems);

          // limpiar carrito backend (opcional)
          // await cartService.clearCart();
          
          // sincronizo cada item individualmente
          for (const item of currentItems) {
            const response = await cartService.addToCart(item.id, item.quantity, userId);
            if (!response.success) throw new Error(response.message || `Failed to sync item ${item.id}`);
          }
          
          set({
            items: currentItems,
            total: calculateTotal(currentItems),
            isLoading: false
          });
          
          console.log('cart sync complete successfully');

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



