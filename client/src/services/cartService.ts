import { CartResponse } from "../types";
import AuthService from "./authService";

const API_BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';
if(!API_BASE_URL) {
    throw new Error("BACKEND_URL no está definido en el .env");
}

class CartService {
    // verificar si el usuario está autenticado
    private ensureAuthenticated(): boolean {
        return AuthService.isAuthenticated();
    }

    // obtener headers con autenticación
    private getAuthHeaders(): Record<string, string> {
        const token = AuthService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // obtengo el id del usuario para agregar un producto al carriot (fundamental)
    private getCurrentUserId(): number | null {
        const currentUser = AuthService.getCurrentUser();
        return currentUser ? currentUser.id_u : null;
    }

    // agregar producto al carrito
    async addToCart(productId: number, quantity: number = 1, userId: number): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return {
                success: false,
                message: 'You must be logged in to add items to cart'
            };
        }

        try {
            const currentUserId = this.getCurrentUserId();
            
            if (!userId && currentUserId) {
                userId = currentUserId;

            }
        
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    productId,
                    quantity,
                    userId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error adding to cart');
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error adding to cart:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    //obtener carrito del usuario
    async getCart(): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return {
                success: false,
                message: 'You must be logged in to view cart'
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error fetching cart');
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching cart:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // actualizar cantidad de un item
    async updateCartItem(cartId: number, productId: number, quantity: number): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return {
                success: false,
                message: 'You must be logged in to update cart'
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ productId, quantity })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error updating cart item');
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error updating cart item:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // eliminar item del carrito
    async removeFromCart(productId: number): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return {
                success: false,
                message: 'You must be logged in to remove items'
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error removing from cart');
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error removing from cart:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // limpiar carrito
    async clearCart(): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return {
                success: false,
                message: 'You must be logged in to clear cart'
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/clear`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error clearing cart');
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error clearing cart:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // cantidad total de items
    async getCartCount(): Promise<number> {
        if (!this.ensureAuthenticated()) {
            return 0;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/count`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                return 0;
            }

            return data.data?.count || 0;
        } catch (error) {
            console.error('Error getting cart count:', error);
            return 0;
        }
    }
}

export default new CartService();