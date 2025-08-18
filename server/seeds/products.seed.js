import fs from "fs";
import path from "path";
// import dotenv from "dotenv";
import { insertProduct, updateProductById } from "../services/productService.js";
import { query } from "../config/db.js";

// dotenv.config();

// const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;
const seedFilePath = path.resolve("./seeds/products.seed.json");

export const seedProducts = async () => {
    const dataSeed = fs.readFileSync(seedFilePath, "utf-8");
    const productsSeed = JSON.parse(dataSeed);
    for(const product of productsSeed) {
        // busco por nombre para evitar duplicados
        const result = await query(
            "SELECT * FROM fluxshop_products WHERE name_p = $1",
            [product.name]
        );

        const imageUrl = `${product.image}`;

        if(result.rows.length === 0) {
            await insertProduct(
                product.name,
                product.description,
                product.price,
                imageUrl,
                product.category
            );
            console.log(`productos insertados: ${product.name}`);
        }else{
            const id = result.rows[0].id_p;
            await updateProductById(id, {
                name: product.name,
                description: product.description,
                price: product.price,
                image: imageUrl,
                category: product.category
            });
            console.log(`actualizado: ${product.name}`);
        }
    }
}