import express from "express"
import ensureToken from "../middleware/authMiddleware.js"
import { requirePermission } from "../middleware/requirePermission.js";
import { createProduct, updateProduct, deleteProduct, upload } from "../controllers/admin/adminProdController.js";

const r = express.Router();

// todas las rutas requieren autenticación
// rutas para user admin (puede hacer todo lo de user común + administrar productos que es agregar sus propios productos y subirlos para "la venta" y que el user común pueda comprarlos)
r.post("/products/create", ensureToken, requirePermission("create_products"), upload.single("image"), createProduct);
r.put("/products/update/:id", ensureToken, requirePermission("update_products"), updateProduct);
r.delete("/products/delete/:id", ensureToken, requirePermission("delete_products"), deleteProduct);

export default r;