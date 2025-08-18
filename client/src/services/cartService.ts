// services/cartService.ts
import { apiClient } from "../core/apiClient";
import { CartResponse } from "../types/prodCart";
import AuthService from "./authService";

class CartService {
    private ensureAuthenticated(): boolean {
        return AuthService.isAuthenticated();
    }

    private getCurrentUserId(): number | null {
        const currentUser = AuthService.getCurrentUser();
        return currentUser ? currentUser.id_u : null;
    }

    async addToCart(productId: number, quantity: number = 1, userId?: number): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return { success: false, message: "You must be logged in to add items to cart" };
        }

        if (!userId) {
            const currentUserId = this.getCurrentUserId();
            if (!currentUserId) {
                return { success: false, message: "User ID not found" };
            }
            userId = currentUserId;
        }

        try {
            const data = await apiClient("/cart", {
                method: "POST",
                token: AuthService.getToken(),
                body: { productId, quantity, userId }
            });
            return { success: true, data };
        } catch (error) {
            console.error("Error adding to cart:", error);
            return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred" };
        }
    }

    async getCart(): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return { success: false, message: "You must be logged in to view cart" };
        }

        try {
            const data = await apiClient("/cart", {
                method: "GET",
                token: AuthService.getToken()
            });
            return { success: true, data };
        } catch (error) {
            console.error("Error fetching cart:", error);
            return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred" };
        }
    }

    async updateCartItem(cartId: number, productId: number, quantity: number): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return { success: false, message: "You must be logged in to update cart" };
        }

        try {
            const data = await apiClient(`/cart/${cartId}`, {
                method: "PUT",
                token: AuthService.getToken(),
                body: { productId, quantity }
            });
            return { success: true, data };
        } catch (error) {
            console.error("Error updating cart item:", error);
            return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred" };
        }
    }

    async removeFromCart(productId: number): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return { success: false, message: "You must be logged in to remove items" };
        }

        try {
            const data = await apiClient(`/cart/${productId}`, {
                method: "DELETE",
                token: AuthService.getToken()
            });
            return { success: true, data };
        } catch (error) {
            console.error("Error removing from cart:", error);
            return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred" };
        }
    }

    async clearCart(): Promise<CartResponse> {
        if (!this.ensureAuthenticated()) {
            return { success: false, message: "You must be logged in to clear cart" };
        }

        try {
            const data = await apiClient("/cart/clear", {
                method: "DELETE",
                token: AuthService.getToken()
            });
            return { success: true, data };
        } catch (error) {
            console.error("Error clearing cart:", error);
            return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred" };
        }
    }

    async getCartCount(): Promise<number> {
        if (!this.ensureAuthenticated()) return 0;

        try {
            const data = await apiClient("/cart/count", {
                method: "GET",
                token: AuthService.getToken()
            });
            return data?.data?.count || 0;
        } catch (error) {
            console.error("Error getting cart count:", error);
            return 0;
        }
    }

    async handlePurchase(): Promise<{ success: boolean; purchaseId?: number; message?: string }> {
        if (!this.ensureAuthenticated()) {
            return { success: false, message: "You must be logged in to purchase" };
        }

        try {
            const data = await apiClient("/api/cart/purchase", {
                method: "POST",
                token: AuthService.getToken()
            });

            await this.clearCart();
            return { success: true, purchaseId: data.purchaseId };
        } catch (error) {
            console.error("Error in handlePurchase:", error);
            return { success: false, message: error instanceof Error ? error.message : "Unexpected error" };
        }
    }
}

export default new CartService();
