import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import multer from "multer";
import { deleteProductById, findProductById, insertProduct, updateProductById } from "../../services/productService.js";

const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;

const __dirname = path.resolve(); // para ESM
const UPLOAD_DIR = path.join(__dirname, "public/products_screen");
const SEED_PATH = path.join(__dirname, "seeds/products.seed.json");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Configuración de multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
export const upload = multer({ storage });

/**
 * Crear un nuevo producto (Solo para usuario admin)
 */

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!req.file || !name || !description || !price || !category) {
      return res.status(400).json({ success: false, error: "Todos los campos son requeridos" });
    }

    const image = `/products_screen/${req.file.filename}`;
    const newProductId = await insertProduct(name, description, Number(price), image, category);

    // Actualizo seed JSON
    const seedData = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
    seedData.push({ name, description, price: Number(price), image, category });
    fs.writeFileSync(SEED_PATH, JSON.stringify(seedData, null, 2));

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      productId: newProductId,
      imageUrl: image,
    });
  } catch (error) {
    console.error("Error al crear producto: ", error);
    res.status(500).json({ success: false, error: "Error al crear el producto" });
  }
};

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