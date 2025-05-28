import jwt from "jsonwebtoken"

const generateToken = (payload, secret = process.env.JWT_SECRET || "my_secret_key", options={expiresIn:"1h"}) => {
    try {

        console.log("- GENERANDO TOKEN -")
        console.log("Payload recibido: ", payload);
        console.log("Propiedades del payload: ", Object.keys(payload));
        console.log("payload.id_u: ", payload.id_u);
        console.log("payload.id: ", payload.id);

        const token = jwt.sign(
            payload,
            secret,
            options,
        );

        console.log("Token generado con éxito: ", token);
        
        const decoded = jwt.verify(token, secret);
        console.log("Token decodificado (verificación): ", decoded)

        return token;
    } catch (error) {
        if(error instanceof Error) {
            throw new Error("Error al generar el token:", error.message);
        }
        throw new Error("Error desconocido al generar token");
    }
}

export {generateToken};