import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express"
import bodyParser from "body-parser"

import {PORT, FRONTEND_URL} from "./config/config.js"
import { query } from "./config/db.js";
import router from "./routes/authRoutes.js";
import { hashPassword } from "./services/hashPassword.js";

const app = express()

// middlewares
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}))
app.use(bodyParser.json());
// app.use(express.urlencoded({extended:true | false}));
// app.use(express.json())

// routes
app.get("/", (req, res) => {
    res.json({message: "welcome to my app"});
})

app.use(router);

app.get("/conn", async (req, res) => {
    try {
        const result = await query("SELECT NOW()");
        console.log("DB Conectada y Servidor Funcionando: ", result.rows[0]);
        res.json({message: "DB Conectada y Servidor Funcionando"})
    } catch (error) {
        console.error("Database connection error: ", error);
        res.status(500).json({error: "Database connection error"})
    }
});

hashPassword()
    .then(() => {
        console.log("Todas las contraseñas han sido hasheadas.");
    })
    .catch((error) => {
        console.error("Aviso de contraseñas: ", error.message);
    })


// handling errors
// app.use((err, req, res, next) => {
//     return res.status(500).json({
//         status: "error",
//         message: err.message,
//     });
// });


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto http://0.0.0.0:${PORT}`);
})