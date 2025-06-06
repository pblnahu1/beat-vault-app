import { query } from "../config/db.js";

export const productGetter = async (_req, res) => {
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

/**
 * Obtener todos los productos
 */

export const getAllProducts = async(_req,res)=>{
    try {
        const QUERY = await query("SELECT * FROM fluxshop_products", []);

        const products = QUERY.rows.map(p => ({
            id: p.id_p,
            name: p.name_p,
            description: p.description_p,
            price: p.price_p,
            image: `http://localhost:3000/static/${p.image_p}`,
            category: p.category_p
        }));
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
            image: `http://localhost:3000/static/${p.image_p}`,
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
            image: `http://localhost:3000/static/${p.image_p}`,
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

/**
 * Crear un nuevo producto (Solo para usuario admin)
 */

export const createProduct = async (req, res) => {
    try {
        const {name, description, price, image, category} = req.body;

        if(!name || !description || !price || !image || !category) {
            return res.status(400).json({
                success: false,
                error: "Todos los campos son requeridos"
            });
        }

        const QUERY = await query(
            "INSERT INTO fluxshop_products (name_p, description_p, price_p, image_p, category_p) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, description, price, image, category]
        );

        const p = QUERY.rows[0];
        const product = {
            id: p.id_p,
            name: p.name_p,
            description: p.description_p,
            price: p.price_p,
            image: `http://localhost:3000/static/${p.image_p}`,
            category: p.category_p
        }

        res.status(201).json(product);
    } catch (error) {
        console.error("Error al crear producto: ",error);
        res.status(500).json({
            success:false,
            error: "Error al crear el produccto"
        })
    }
}

/**
 * Actualizar un producto existente (solo para user admin)
 */

export const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description, price, image, category} = req.body;

        // verificar si el producto existe
        const checkQuery = await query("SELECT * FROM fluxshop_products WHERE id_p = $1", [id]);

        if(checkQuery.rows.length === 0) {
            return res.status(404).json({
                success:false,
                error: "Producto no encontrado"
            });
        }

        // construir la consulta dinámicamente basada en los campos proporcionados
        let updateFields = [];
        let queryParams = [];
        let paramCounter = 1;

        if(name !== undefined){
            updateFields.push(`name_p = $${paramCounter}`);
            queryParams.push(name);
            paramCounter++;
        }

        if(description !== undefined){
            updateFields.push(`description_p = $${paramCounter}`);
            queryParams.push(description);
            paramCounter++;
        }

        if(price !== undefined){
            updateFields.push(`price_p = $${paramCounter}`);
            queryParams.push(price);
            paramCounter++;
        }

        if(image !== undefined) {
            updateFields.push(`image_p = $${paramCounter}`);
            queryParams.push(image);
            paramCounter++;
        }

        if(category !== undefined) {
            updateFields.push(`category_p = $${paramCounter}`);
            queryParams.push(category);
            paramCounter++;
        }

        if(updateFields.length === 0){
            return res.status(400).json({
                success: false,
                error: "No se proporcionaron campos para actualizar"
            });
        }

        // agrego el ID  al final de los parámetros
        queryParams.push(id);

        const updateQuery = `
            UPDATE fluxshop_products
            SET ${updateFields.join(', ')}
            WHERE id_p = $${paramCounter}
            RETURNING *
        `;

        const QUERY = await query(updateQuery, queryParams);

        const p = QUERY.rows[0];
        const product = {
            id: p.id_p,
            name: p.name_p,
            description: p.description_p,
            price: p.price_p,
            image: `http://localhost:3000/static/${p.image_p}`,
            category: p.category_p
        };

        res.json(product);
    } catch (error) {
        console.error(`Error al actualizar producto con ID ${req.params.id}: `, error);
        res.status(500).json({
            success: false,
            error: "Error al actualizar el producto"
        });
    }
};

/**
 * Eliminar un producto (solo para user admin)
 */

export const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;

        // verifico si el producto existe
        const checkQuery = await query("SELECT * FROM fluxshop_products WHERE id_p = $1", [id]);

        if(checkQuery.rows.length === 0){
            return res.status(404).json({
                success: false,
                error: "Producto no encontrado"
            });
        }

        await query("DELETE FROM fluxshop_products WHERE id_p = $1", [id]);

        res.json({
            success: true,
            message: `Producto con ID ${id} eliminado correctamente`
        });
    } catch (error) {
        console.error(`Error al eliminar producto con ID ${req.params.id}: `, error);
        res.status(500).json({
            success: false,
            error: "Error al eliminar el producto"
        });
    }
};

// exporto el metodo original para compatibbilidad con código existente
// const productGetter = getAllProducts;
export default productGetter;