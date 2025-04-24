import { query } from "../config/db.js";

const productGetter = async (req, res) => {
    try {
        // const {id_p, name_p, description_p, price_p, image_p, category_p} = req.body;

        const QUERY = await query("SELECT * FROM fluxshop_products", []);
        // await query('SELECT * FROM fluxshop_products WHERE category_p = $1', ['Electronics']);

        const prod = QUERY.rows.map(p => ({
            ...p,
            image_p: `http://localhost:3000/static/${p.image_p}`
        }))

        res.json(prod);
    } catch (error) {
        if(error instanceof Error) {
            throw new Error("Error al consultar datos a la tabla fluxshop_products");
        }
        res.status(500).json({
            success: false,
            error: "error fetching products"
        })

    }
}

export default productGetter;