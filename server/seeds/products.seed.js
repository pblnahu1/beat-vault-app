import fs from "fs";
import path from "path";
import { insertProduct, updateProductById, deleteProductById } from "../services/productService.js";
import { query } from "../config/db.js";

const seedFilePath = path.resolve("./seeds/products.seed.json");

export const seedProducts = async () => {
  try {
    const dataSeed = fs.readFileSync(seedFilePath, "utf-8");
    const productsSeed = JSON.parse(dataSeed);
    const dbProductsResult = await query("SELECT id_p, name_p, description_p, price_p, image_p, category_p FROM fluxshop_products");
    const dbProducts = dbProductsResult.rows;
    const seedNames = productsSeed.map(p => p.name);

    for (const product of productsSeed) {
      const existing = dbProducts.find(p => p.name_p === product.name);

      const price = Number(product.price); // asegurar número
      const imageUrl = product.image; // mantener el formato del JSON

      if (!existing) {
        // solo si no existe
        await insertProduct(product.name, product.description, price, imageUrl, product.category);
        console.log(`Producto insertado: ${product.name}`);
      } else {
        // solo si hubo cambios
        const hasChanges =
          existing.description_p !== product.description ||
          existing.price_p !== price ||
          existing.image_p !== imageUrl ||
          existing.category_p !== product.category;

        if (hasChanges) {
          await updateProductById(existing.id_p, {
            description: product.description,
            price,
            image: imageUrl,
            category: product.category,
          });
          console.log(`Producto actualizado: ${product.name}`);
        }
      }
    }

    // elimina productos que ya no están en el seed
    for (const dbProduct of dbProducts) {
      if (!seedNames.includes(dbProduct.name_p)) {
        await deleteProductById(dbProduct.id_p);
        console.log(`Producto eliminado por estar fuera del seed: ${dbProduct.name_p}`);
      }
    }

    console.log("Seed de productos finalizado correctamente.");
  } catch (error) {
    console.error("Error en seedProducts:", error.message, error.stack);
  }
};
