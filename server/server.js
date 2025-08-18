
// VER QUE EL ERROR ESTÁ EN HELMET Y MORGAN Y UNAS CONFIG MÁS NO SÉ XQ.......

import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express"
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
// import helmet from "helmet";
// import morgan from "morgan";
import {PORT, FRONTEND_URL} from "./config/config.js"
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { seedProducts } from "./seeds/products.seed.js";
// import hashPasswordExec from "./scripts/hashPasswordExec.js";

const app = express()

app.use(cors({
    origin: FRONTEND_URL, 
    credentials: true
}));
app.use(bodyParser.json());
// app.use(express.json({limit: '10mb'}));
// app.use(express.urlencoded({extended:true}));
// app.use(helmet());
// app.use(morgan('combined'));

// para los productos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/static", express.static(path.join(__dirname, "public")));

await seedProducts();

app.use(publicRoutes);
app.use("/admin", adminRoutes);

// hashPasswordExec();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto http://0.0.0.0:${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
})
