import { apiClient } from "../api/apiClient"
import authService from "./authService";

export const orderService = {
    async getOrderHistory() {
        const token = authService.getToken();
        try {
            const data = await apiClient("/api/purchases/history", {
                token: token || undefined, // Cambiar "" por undefined
            });
            
            // ya lo hace apiClient por eso el error
            // if(!data.success) throw new Error("Error fetching orders");
            
            return data.purchases || data.data || data || [];
            
        } catch (error) {
            console.error("Error en orderService:", error);
            throw error;
        }
    },
};