import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

export const hashPassword = async ()=> {
    try {
        const users = await query("SELECT id_u, hashed_password FROM users");
        for(const u of users.rows) {
            if(u.hashed_password.startsWith("$2b$")) {
                continue; // si ya está encriptada salta al otro usuario
            }

            const hashedPassword = await bcrypt.hash(u.hashed_password,10);
            await query("UPDATE users SET hashed_password = $1 WHERE id_u = $2", [
                hashedPassword,
                u.id_u,
            ]);

            console.log(`Contraseña para el usuario ${u.id_u} hasheada correctamente`);
        }
    } catch (error) {
        console.error("Aviso de contraseñas: ", error.message);
    }
};