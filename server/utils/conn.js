import {query} from "../config/db.js"

const testConnection = async () => {
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

const connDB = async (req, res) => {
    const connectionStatus = await testConnection();

    if(connectionStatus.success) {
        console.log("DB Conectada y Servidor Funcionando: ", connectionStatus.data);
        res.json({
            message: connectionStatus.message
        });
    }else{
        console.error("Error de conexión: ", connectionStatus.error);
        res.status(500).json({
            error: connectionStatus.error
        })
    }
}

export default connDB;