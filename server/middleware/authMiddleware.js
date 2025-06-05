// protege rutas (verifica jwt)

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ensureToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // bearer <token> !!! importante

    if(!token) {
        return res.status(401).json({
            message: "Acceso denegado, token no proporcionado"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "my_secret_key");
        // if(!decoded?.id_u) {
        //     return res.status(401).json({
        //         message: "Token inválido"
        //     });
        // }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Token no válido o expirado"
        });
    }
}

export default ensureToken;