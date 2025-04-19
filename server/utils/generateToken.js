import jwt from "jsonwebtoken"

const generateToken = (payload, secret = process.env.JWT_SECRET || "my_secret_key", options={expiresIn:"1h"}) => {
    try {
        const token = jwt.sign(
            payload,
            secret,
            options,
        );
        console.log("Token generado con éxito: ", token);
        return token;
    } catch (error) {
        if(error instanceof Error) {
            throw new Error("Error al generar el token:", error.message);
        }
        throw new Error("Error desconocido al generar token");
    }
}

export {generateToken};