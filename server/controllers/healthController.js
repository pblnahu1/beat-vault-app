
import { testConnection } from "../services/dbService.js";

// funcion asincrona para  monitoreo o para acceder vía HTTP a la salud del backend y DB
const connDB = async (_req, res) => {
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