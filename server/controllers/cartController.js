import { getCart, addOrUpdate, remove, clearCart, getCartCount } from "../services/cartService.js";

export const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id_u;
        const items = await getCart(userId);
        
        res.json({
            success: true,
            data: items,
            count: items.length
        });
    } catch (error) {
        console.error('Error getting cart items:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting cart items',
            error: error.message
        });
    }
};

export const addOrUpdateCartItem = async (req, res) => {
    try {
        const userId = req.user.id_u;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and quantity are required'
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0'
            });
        }

        const result = await addOrUpdate(userId, productId, quantity);
        
        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: result
        });
    } catch (error) {
        console.error('Error adding/updating cart item:', error);
        
        if (error.message === 'Product not found') {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id_u;
        const productId = parseInt(req.params.productId);

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const result = await remove(userId, productId);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        res.json({
            success: true,
            message: 'Item removed from cart successfully'
        });
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item from cart',
            error: error.message
        });
    }
};

export const clearCartItems = async (req, res) => {
    try {
        const userId = req.user.id_u;
        const result = await clearCart(userId);
        
        res.json({
            success: true,
            message: 'Cart cleared successfully',
            itemsRemoved: result.length
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
};

export const getCartItemCount = async (req, res) => {
    try {
        const userId = req.user.id_u;
        const count = await getCartCount(userId);
        
        res.json({
            success: true,
            data: { count: parseInt(count) }
        });
    } catch (error) {
        console.error('Error getting cart count:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting cart count',
            error: error.message
        });
    }
};