import dotenv from "dotenv";
dotenv.config();
// import { query } from "../../config/db.js";
import { deleteProductById, findProductById, insertProduct, updateProductById } from "../../services/productService.js";

// constante base para URL de imágenes (mejor que hardcodear directamente dentro del map)
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;

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

        // const QUERY = await query(
        //     "INSERT INTO fluxshop_products (name_p, description_p, price_p, image_p, category_p) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, description, price, image, category]
        // );

        // const p = QUERY.rows[0];
        // const product = {
        //     id: p.id_p,
        //     name: p.name_p,
        //     description: p.description_p,
        //     price: p.price_p,
        //     image: `${IMAGE_BASE_URL}/${p.image_p}`,
        //     category: p.category_p
        // }

        // res.status(201).json(product);


        const newProductId = await insertProduct(name, description, price, image, category);
        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente",
            productId: newProductId
        })

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
        const fieldsToUpdate = req.body;

        // verificar si el producto existe
        // const checkQuery = await query("SELECT * FROM fluxshop_products WHERE id_p = $1", [id]);

        const existingProduct = await findProductById(id);

        // if(checkQuery.rows.length === 0) {
        if(!existingProduct) {
            return res.status(404).json({
                success:false,
                error: "Producto no encontrado"
            });
        }

        // construir la consulta dinámicamente basada en los campos proporcionados
        // let updateFields = [];
        // let queryParams = [];
        // let paramCounter = 1;

        const updateProduct = await updateProductById(id, fieldsToUpdate);

        // if(name !== undefined){
        //     updateFields.push(`name_p = $${paramCounter}`);
        //     queryParams.push(name);
        //     paramCounter++;
        // }

        // if(description !== undefined){
        //     updateFields.push(`description_p = $${paramCounter}`);
        //     queryParams.push(description);
        //     paramCounter++;
        // }

        // if(price !== undefined){
        //     updateFields.push(`price_p = $${paramCounter}`);
        //     queryParams.push(price);
        //     paramCounter++;
        // }

        // if(image !== undefined) {
        //     updateFields.push(`image_p = $${paramCounter}`);
        //     queryParams.push(image);
        //     paramCounter++;
        // }

        // if(category !== undefined) {
        //     updateFields.push(`category_p = $${paramCounter}`);
        //     queryParams.push(category);
        //     paramCounter++;
        // }

        // if(updateFields.length === 0){
        if(!updateProduct){
            return res.status(400).json({
                success: false,
                error: "No se proporcionaron campos para actualizar"
            });
        }

        // agrego el ID  al final de los parámetros
        // queryParams.push(id);

        // const updateQuery = `
        //     UPDATE fluxshop_products
        //     SET ${updateFields.join(', ')}
        //     WHERE id_p = $${paramCounter}
        //     RETURNING *
        // `;

        // const QUERY = await query(updateQuery, queryParams);

        // const p = QUERY.rows[0];

        const product = {
            id: updateProduct.id_p,
            name: updateProduct.name_p,
            description: updateProduct.description_p,
            price: updateProduct.price_p,
            image: `${IMAGE_BASE_URL}/${updateProduct.image_p}`,
            category: updateProduct.category_p
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
        // const checkQuery = await query("SELECT * FROM fluxshop_products WHERE id_p = $1", [id]);
        const existingProduct = await findProductById(id);

        // if(checkQuery.rows.length === 0){
        if(!existingProduct) {
            return res.status(404).json({
                success: false,
                error: "Producto no encontrado"
            });
        }

        // await query("DELETE FROM fluxshop_products WHERE id_p = $1", [id]);
        await deleteProductById(id);

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