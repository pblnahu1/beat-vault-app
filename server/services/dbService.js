import {query} from "../config/db.js"

// función asincrona para automatización, testing de despliegues, o CI/CD
export const testConnection = async () => {
    try {
        const result = await query("SELECT NOW()");
        return {
            success: true,
            data: result.rows[0],
            message: "DB Conectada y Servidor Funcionando"
        };
    } catch (error) {
        return {
            success: false,
            error: "Error de conexión a la base de datos",
            details: error.message
        };
    }
}