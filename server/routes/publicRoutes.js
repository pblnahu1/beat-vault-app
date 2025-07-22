// importante antes probar en postman o insomnia para
// asegurarse de que estamos haciendo las requests correctamente
// con las rutas establecidas

import express from "express";
import debugAPI from "../controllers/debugController.js";
import connDB from "../controllers/healthController.js";
import {
  pausedAccountAndLogout,
  loginUser,
  registerUser,
  reactivateAccount,
  deleteAccountForever,
  getUserIdByEmail
} from "../controllers/authController.js";
import ensureToken from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductsById,
  getProductsByCategory,
} from "../controllers/prodController.js";
import {
  getCartItems,
  addOrUpdateCartItem,
  removeCartItem,
  clearCartItems,
  getCartItemCount,
} from "../controllers/cartController.js";

const r = express.Router();

// DEBUG API
/**
 * @route GET /
 * @desc Verifica el estado de la API
 * @access Public
 */
r.get("/api", debugAPI);

// CONEXIÓN BD
/**
 * @route GET /status
 * @desc Verifica el estado de conexión de la Base de Datos
 * @access Public
 */
r.get("/api/status", connDB);

// USERS
/**
 * @route POST /auth/login
 * @desc Inicia sesión de usuario
 * @route POST /auth/create-account
 * @desc Crea una nueva cuenta de usuario
 * @access Public
 */
r.post("/api/auth/login", loginUser);
r.post("/api/auth/create-account", registerUser);
r.post("/api/users/paused-account", pausedAccountAndLogout);
r.patch("/api/users/:id/reactivate-account", reactivateAccount);
r.delete("/api/users/:id", deleteAccountForever);
r.get("/api/users/id-by-email", getUserIdByEmail);

// PROTECTED ROUTE (user dashboard)
/**
 * @route GET /dashboard/:username
 * @desc Dashboard de usuario
 * @access Private
 */
r.get("/dashboard/:username", ensureToken, (req, res) => {
  res.json({
    message: "Bienvenido al panel de usuario",
    user: req.user,
  });
});

// PRODUCTS
/**
 * @route GET /products
 * @desc Obtiene todos los productos
 * @route GET /products/:id
 * @desc Obtiene un producto por su ID
 * @route GET /products/category/:category
 * @desc Obtiene todos los productos de una categoría
 * @access Public
 */
// rutas para user común (este podrá ver todos los productos pero no podrá modificarlos, sólo podrá modificar su cuenta de usuario y su carrito todo dentro del dashboard de usuario)
r.get("/products", getAllProducts);
r.get("/products/:id", getProductsById);
r.get("/products/category/:category", getProductsByCategory);

// CART ITEMS
/**
 * @route GET /cart
 * @desc Obtiene el carrito de compras del usuario
 * @route POST /cart
 * @desc Agrega un producto al carrito de compras del usuario
 * @route DELETE /cart/:productId
 * @desc Elimina un producto del carrito de compras del usuario
 */
// Todas las rutas requieren autenticación
r.get("/cart", ensureToken, getCartItems);
r.post("/cart", ensureToken, addOrUpdateCartItem);
r.put("/cart/:productId", ensureToken, addOrUpdateCartItem);
r.delete("/cart/clear", ensureToken, clearCartItems);
r.delete("/cart/:productId", ensureToken, removeCartItem);
r.get("/cart/count", ensureToken, getCartItemCount);

export default r;
