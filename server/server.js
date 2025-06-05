import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express"
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser"
import helmet from "helmet";
import morgan from "morgan";

import {PORT, FRONTEND_URL} from "./config/config.js"
import router from "./routes/authRoutes.js";
import hashPasswordExec from "./utils/hashPasswordExec.js";
import errorHandler, { notFoundHandler } from "./middleware/errorHandler.js";

const app = express()

// middlewares
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}))
app.use(bodyParser.json());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(morgan('combined'));

// Obtener el nombre del directorio del archivo actual
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/static", express.static(path.join(__dirname, "public"))); // http://localhost:3000/static/products_screen/headphones.jpg

app.use(router);

hashPasswordExec();

// manejo de errores
app.use(notFoundHandler);// error 404 para rutas no encontradas
app.use(errorHandler); //manejo general de errorres

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto http://0.0.0.0:${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}` || 'development');
})