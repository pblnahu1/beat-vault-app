import dotenv from "dotenv";
dotenv.config();
import { query } from "../../config/db.js";
/**
 * Obtener todos los productos
 */

// constante base para URL de imágenes (mejor que hardcodear directamente dentro del map)
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;

export const getAllProducts = async(_req,res)=>{
    try {
        const QUERY = await query("SELECT * FROM fluxshop_products", []);

        // formatea los resultados para enviar solo los campos relevantes al cliente
        const products = QUERY.rows.map((p) => ({
            id: p.id_p,
            name: p.name_p,
            description: p.description_p,
            price: p.price_p,
            image: `${IMAGE_BASE_URL}/${p.image_p}`,
            category: p.category_p
        }));

        // envía los productos en formato JSON
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:",error);
        res.status(500).json({
            success:false,
            error:"Error al obtener productos"
        });
    }
}

/**
 * obtener un producto por ID
 */

export const getProductsById = async (req,res)=>{
    try {
        const {id} = req.params;

        const QUERY = await query("SELECT * FROM fluxshop_products WHERE id_p = $1", [id]);

        if(QUERY.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Producto no encontrado"
            });
        }

        const p = QUERY.rows[0];
        const product = {
            id: p.id_p,
            name: p.name_p,
            description: p.description_p,
            price: p.price_p,
            image: `${IMAGE_BASE_URL}/${p.image_p}`,
            category: p.category_p
        };

        res.json(product);
    } catch (error) {
        console.error(`Error al obtener producto con ID ${req.params.id}: `, error);
        res.status(500).json({
            success: false,
            error: "Error al obtener el producto"
        })
    }
}

/**
 * obtener productos por categoria
 */

export const getProductsByCategory = async (req,res) => {
    try {
        const {category} = req.params;

        const QUERY = await query("SELECT * FROM fluxshop_products WHERE LOWER(category_p) = LOWER($1)", [category]);

        const products = QUERY.rows.map(p => ({
            id: p.id_p,
            name: p.name_p,
            description: p.description_p,
            price: p.price_p,
            image: `${IMAGE_BASE_URL}/${p.image_p}`,
            category: p.category_p
        }));

        res.json(products);
    } catch (error) {
        console.error(`Error al obtener productos de categoría ${req.params.category}:`, error);
        res.status(500).json({
            success: false,
            message: "Error al obtener productos por categoria"
        });
    }
};



// exporto el metodo original para compatibbilidad con código existente
// const productGetter = getAllProducts;
// export default productGetter;