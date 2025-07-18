import { query } from "../config/db.js";

export const findUserByEmail = async (email) => {
    const queryQuery = "SELECT id_u FROM users WHERE email = $1";
    const values = [email];

    const result = await query(queryQuery, values);

    return result.rows[0]; // puede devolver undefined si no hay resultado
};
