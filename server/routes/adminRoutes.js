/*import express from "express"
import ensureToken from "../middleware/authMiddleware"
import isAdmin from "../middleware/isAdminMiddleware"
import {
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/prodController.js";

const r = express.Router();

// todas las rutas requieren autenticación
// rutas para user admin (puede hacer todo lo de user común + administrar productos que es agregar sus propios productos y subirlos para "la venta" y que el user común pueda comprarlos)
r.post("/products", ensureToken, isAdmin, createProduct);
r.put("/products/:id", ensureToken, isAdmin, updateProduct);
r.delete("/products/:id", ensureToken, isAdmin, deleteProduct);

export default r;*/