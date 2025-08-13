import {client} from "../config/db.js"

export const getPurchaseHistory = async (req, res) => {
  const userId = req.user.id_u;
  const dbClient = await client();

  try {
    const { rows: purchases } = await dbClient.query(`
      SELECT id_purchase_history, total_amount, status, purchase_date
      FROM purchase_history
      WHERE id_u = $1
      ORDER BY purchase_date DESC
    `, [userId]);

    if(purchases.length === 0) {
      return res.json({ purchases: [] });
    }

    // Obtener items para cada compra
    for (const purchase of purchases) {
      const { rows: items } = await dbClient.query(`
        SELECT p.name_p AS name, pi.quantity, pi.price
        FROM purchase_items pi
        JOIN fluxshop_products p ON pi.id_p = p.id_p
        WHERE pi.id_purchase_history = $1
      `, [purchase.id_purchase_history]);

      purchase.items = items;
      purchase.date = purchase.purchase_date.toISOString().slice(0,10); // formatear fecha YYYY-MM-DD
    }

    res.json({ purchases });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching purchase history" });
  } finally {
    dbClient.release();
  }
};
