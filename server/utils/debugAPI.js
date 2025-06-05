/**
 * @description Endpoint de diagnóstico para verificar que la API está funcionando
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
const debugAPI = (req, res) => {
    res.json({
        status: "success",
        message: "API Funcionando correctamente!",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
}

export default debugAPI;