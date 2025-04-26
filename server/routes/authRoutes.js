
// importante antes probar en postman o insomnia para 
// asegurarse de que estamos haciendo las requests correctamente
// con las rutas establecidas 

import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import ensureToken from "../middleware/authMiddleware.js";
import productGetter, {
    getProductsById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/prodController.js";

const router = express.Router()

///////////////////////////////////
// USERS
router.post("/account/login", loginUser);

// ruta protegida
router.get("/dashboard/:username", ensureToken, (req,res) => {
    res.json({
        message: "Bienvenido al panel de usuario",
        user: req.user
    })
})

router.post("/account/create-account", registerUser);

///////////////////////////////////
// PRODUCTS
// rutas para user común (este podrá ver todos los productos pero no podrá modificarlos, sólo podrá modificar su cuenta de usuario y su carrito todo dentro del dashboard de usuario)
router.get("/products", productGetter);
router.get('/products/:id', getProductsById);
router.get('/products/category/:category', getProductsByCategory);
// rutas para user admin (puede hacer todo lo de user común + administrar productos que es agregar sus propios productos y subirlos para "la venta" y que el user común pueda comprarlos)
// router.post('/product', createProduct);
// router.put('/product/:id', updateProduct);
// router.delete('/product/:id', deleteProduct);

export default router