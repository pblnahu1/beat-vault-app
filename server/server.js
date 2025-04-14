import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express"
import bodyParser from "body-parser"

import {PORT, FRONTEND_URL} from "./config/config.js"
import { query } from "./config/db.js";

const app = express()

// middlewares
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}))
app.use(bodyParser.json());
// app.use(express.urlencoded({extended:false}));

// routes
app.get("/", (req, res) => {
    res.json({message: "welcome to my app"});
})

// app.use(router);

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


// handling errors
// app.use((err, req, res, next) => {
//     return res.status(500).json({
//         status: "error",
//         message: err.message,
//     });
// });


app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
})