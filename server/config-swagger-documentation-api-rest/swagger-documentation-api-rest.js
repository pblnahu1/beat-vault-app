import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

// const app = express();

// config de swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API-BEATVAULT",
            version: "1.0.0",
            description: "Documentación de la API de BeatVault"
        },
        servers: [{url: "http://localhost:3000"}],
    },
    apis: ["./routes/*.js"], // ruta donde swagger buscará anotaciones
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);