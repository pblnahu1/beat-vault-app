import { query } from "../config/db.js";

export const getCart = async (userId) => {
    try {
        const { rows } = await query(`
            SELECT ci.id_cart, ci.quantity, ci.id_u, ci.id_p,
                   p.id_p, p.name_p, p.description_p, p.price_p, p.image_p, p.category_p
            FROM cart_items ci
            JOIN fluxshop_products p ON ci.id_p = p.id_p
            WHERE ci.id_u = $1
            ORDER BY ci.id_cart DESC
        `, [userId]);
        return rows;
    } catch (error) {
        console.error('Error getting cart:', error);
        throw error;
    }
};

export const addOrUpdate = async (userId, productId, quantity) => {
    try {
        // Verificar si el producto existe
        const productCheck = await query(`
            SELECT id_p FROM fluxshop_products WHERE id_p = $1
        `, [productId]);
        
        if (productCheck.rows.length === 0) {
            throw new Error('Product not found');
        }

        const result = await query(`
            INSERT INTO cart_items (id_u, id_p, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (id_u, id_p)
            DO UPDATE SET 
                quantity = EXCLUDED.quantity,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [userId, productId, quantity]);
        
        return result.rows[0];
    } catch (error) {
        console.error('Error adding/updating cart:', error);
        throw error;
    }
};

export const remove = async (userId, productId) => {
    try {
        const result = await query(`
            DELETE FROM cart_items 
            WHERE id_u = $1 AND id_p = $2
            RETURNING *
        `, [userId, productId]);
        
        return result.rows[0];
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

export const clearCart = async (userId) => {
    try {
        const result = await query(`
            DELETE FROM cart_items WHERE id_u = $1
            RETURNING *
        `, [userId]);
        
        return result.rows;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};

export const getCartCount = async (userId) => {
    try {
        const { rows } = await query(`
            SELECT COALESCE(SUM(quantity), 0) as total_items
            FROM cart_items
            WHERE id_u = $1
        `, [userId]);
        return rows[0].total_items;
    } catch (error) {
        console.error('Error getting cart count:', error);
        throw error;
    }
};