import {client} from "../config/db.js"

export const createPurchase = async (req, res) => {
    const userId = req.user.id_u;
    const dbClient = await client();

    try {
        await dbClient.query('BEGIN');

        const {rows: cartItems} = await dbClient.query(`
            SELECT ci.id_p, ci.quantity, fp.price_p AS price
            FROM cart_items ci
            JOIN fluxshop_products fp ON ci.id_p = fp.id_p
            WHERE ci.id_u = $1  
        `,[userId]);

        if(cartItems.length===0) return res.status(400).json({message:'Carrito vacío'});

        // sumo total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0); 

        // inserto en purchase_history
        const {rows: [purchase]} = await dbClient.query(`
            INSERT INTO purchase_history (id_u, total_amount, status)
            VALUES($1, $2, 'Procesando')    
            RETURNING id_purchase_history
        `, [userId,total]);

        // inserto items
        for(const item of cartItems) {
            await dbClient.query(`
                INSERT INTO purchase_items(id_purchase_history, id_p, quantity, price)
                VALUES($1, $2, $3, $4)
            `, [purchase.id_purchase_history, item.id_p, item.quantity, item.price]);
        }

        // vacio carrito
        await dbClient.query(`DELETE FROM cart_items WHERE id_u = $1`, [userId]);
        
        
        await dbClient.query('COMMIT');

        res.json({
            message: 'Compra registrada',
            purchaseId: purchase.id_purchase_history
        });

    } catch (error) {
        await dbClient.query('ROLLBACK');
        console.error(error);
        res.status(500).json({message: 'Error registrando la compra'});
    }finally{
        dbClient.release();
    }
}