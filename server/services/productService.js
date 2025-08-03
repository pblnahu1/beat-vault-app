import { query } from "../config/db.js";

export const insertProduct = async (
  name,
  description,
  price,
  image,
  category
) => {
  const sql = `
    INSERT INTO fluxshop_products (name_p, description_p, price_p, image_p, category_p)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_p;
  `;

  const result =await query(sql, [name, description, price, image, category]);
  return result.rows[0].id_p;
};

/**
 * Actualizar campos dinámicamente de un producto por ID
 */

export const updateProductById = async (id, fields) => {
  const updateFields = []; // para almcaenar los campos a actualizar
  const values = []; // para almacenar los valores de los campos
  let paramCounter = 1; // contador para los productos de consulta

  for(const[key,dbField] of Object.entries({
    name: "name_p",
    description: "description_p",
    price: "price_p",
    image: "image_p",
    category: "category_p"
  })) {
    if(fields[key] !== undefined) {
      updateFields.push(`${dbField} = $${paramCounter}`);
      values.push(fields[key]);
      paramCounter++;
    }
  }

  if(updateFields.length === 0) return null; // no hay campos para actualizar

  values.push(id);

  const sql = `
    UPDATE fluxshop_products
    SET ${updateFields.join(", ")}
    WHERE id_p = $${paramCounter}
    RETURNING *;
  `;

  const result = await query(sql, values);
  return result.rows[0];
}

/**
 * Eliminar un producto por ID
 */

export const deleteProductById = async (id) => {
  await query("DELETE FROM fluxshop_products WHERE id_p = $1", [id]);
};

/**
 * Buscar un producto por ID
 */

export const findProductById = async (id) => {
  const result = await query("SELECT * FROM fluxshop_products WHERE id_p = $1", [id]);
  return result.rows[0];
};
