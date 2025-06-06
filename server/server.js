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
// import hashPasswordExec from "./scripts/hashPasswordExec.js";
import errorHandler, { notFoundHandler } from "./middleware/errorHandler.js";

const app = express()

app.use(cors({origin: FRONTEND_URL, credentials: true,}));
app.use(bodyParser.json());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(morgan('combined'));
app.use(router);

// para los productos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/static", express.static(path.join(__dirname, "public"))); // http://localhost:3000/static/products_screen/headphones.jpg

// hashPasswordExec();

// manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// listen to port
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto http://0.0.0.0:${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}` || 'development');
})