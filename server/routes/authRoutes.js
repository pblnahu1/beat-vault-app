import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import ensureToken from "../middleware/authMiddleware.js";
import productGetter from "../controllers/prodController.js";

const router = express.Router()

router.post("/account/login", loginUser);

// ruta protegida
router.get("/dashboard/:username", ensureToken, (req,res) => {
    res.json({
        message: "Bienvenido al panel de usuario",
        user: req.user
    })
})

router.post("/account/create-account", registerUser);

router.get("/products", productGetter);

export default router