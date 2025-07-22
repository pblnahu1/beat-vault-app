import { query } from "../config/db.js";

/**
 * Busca un usuario por su email en la base de datos
 * @param {string} email - email del usuario a buscar
 * @returns {object|null} - usuario encontrado o null
 */
export const findUserByEmail = async (email) => {
    const sql = "SELECT id_u FROM users WHERE email = $1";
    try {
        const result = await query(sql, [email]);
        return result.rows[0] || null; // puede devolver undefined si no hay resultado
    } catch (error) {
        console.error("Error en findUserByEmail: ", error);
        throw new Error("Error al buscar usuario por email");
    }
};

/**
 * Actualiza el campo last_login del usuario con la hora actual
 * @param {string} id_u - id del usuario
 */
export const updateLastLogin = async (id_u) => {
    const sql = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id_u = $1";
    try {
        await query(sql, [id_u]);
    } catch (error) {
        console.error("Error en updateLastLogin: ", error);
        throw new Error("Error al actualizar el último inicio de sesión del usuario");
    }
}

/**
 * Verifica si el role existe
 * @param {number} role_id
 * @returns {boolean}
 */

export const roleCheckId = async(role_id) => {
    const sql = "SELECT id_role FROM roles WHERE id_role = $1";
    try {
        const result = await query(sql, [role_id]);
        return result.rows.length > 0; // devuelve true si existe
    } catch (error) {
        console.error("Error en roleCheck: ", error);
        throw new Error("Error al verificar el rol");
    }
}

/**
 * obtengo el id del rol "customer"
 * @param {string} strRole
 * @returns {number|null}
*/

export const getCustomerRoleId = async (strRole) => {
    const sql = "SELECT id_role FROM roles WHERE name_role = $1";
    try {
        const result = await query(sql, [strRole]);
        return result.rows[0]?.id_role || null; // devuelve el id del rol o null si no existe
    } catch (error) {
        console.error("Error en getCustomerRoleId: ", error);
        throw new Error("Error al obtener el ID del Rol.");
    }
}

/**
 * Insertar nuevo usuario
 * @returns {string} - id_u
 */

export const insertUser = async (email, hashedPassword, username, finalRoleId, isActive) => {
    const sql = `
        INSERT INTO users(email, hashed_password, username, role_id, is_active) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id_u
    `;
    try {
        const result = await query(sql, [email, hashedPassword, username, finalRoleId, isActive]);
        return result.rows[0].id_u; // devuelve el ID del usuario insertado
    } catch (error) {
        console.error("Error en insertUser: ", error);
        throw new Error("Error al insertar usuario");
    }
}


/**
 * Desactiva un usuario (pausar cuenta)
 */

export const updateUserStatus = async (id_u) => {
    const sql = "UPDATE users SET is_active = false WHERE id_u = $1";
    try {
        await query(sql, [id_u]);
    } catch (error) {
        console.error("Error en updateUserStatus: ", error);
        throw new Error("Error al actualizar el estado del usuario");
    }
}

/**
 * reactivar la cuenta y actualizar usuario (por ejemplo, al iniciar sesión, pero hay que pulirlo un poco)
 * @returns {objet|null}
 */

export const reactivateUserAccount = async (id_u) => {
    const sql = `
        UPDATE users 
        SET is_active = true, last_login = CURRENT_TIMESTAMP 
        WHERE id_u = $1 
        RETURNING id_u, email, username
    `;
    try {
        const result = await query(sql, [id_u]);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error en reactivateUserAccount: ", error);
        throw new Error("Error al reactivar la cuenta del usuario");
    }
}


/**
 * elimina la cuenta permanentemente
 * @returns {object|null}
 */

export const deleteAccount = async (id_u) => {
    const sql = "DELETE FROM users WHERE id_u = $1 RETURNING id_u";
    try {
        const result = await query(sql, [id_u]);
        return result.rows[0] || null; // devuelve el ID del usuario eliminado
    } catch (error) {
        console.error("Error en deleteAccount: ", error);
        throw new Error("Error al eliminar la cuenta del usuario");
    }
}