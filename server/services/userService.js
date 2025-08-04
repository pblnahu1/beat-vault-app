import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

/**
 * Busco el id solamente del usuario
 * @param {number} id
 * @returns
 */
export const findUserById = async (id) => {
  const result = await query("SELECT * FROM users WHERE id_u = $1", [id]);
  return result.rows[0];
};

/**
 * Busca un usuario por su email en la base de datos
 * @param {string} email - email del usuario a buscar
 * @returns {object|null} - usuario encontrado o null
 */
export const findUserByEmail = async (email) => {
  const sql = "SELECT id_u FROM users WHERE email = $1";
  try {
    const result = await query(sql, [email]);
    return result.rows[0] || null;
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
    throw new Error(
      "Error al actualizar el último inicio de sesión del usuario"
    );
  }
};

/**
 * Verifica si un rol existe por ID
 * @param {number} role_id
 * @returns {boolean}
 */
export const roleCheckId = async (role_id) => {
  const sql = "SELECT id_role FROM roles WHERE id_role = $1";
  try {
    const result = await query(sql, [role_id]);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error en roleCheckId: ", error);
    throw new Error("Error al verificar el rol");
  }
};

/**
 * Obtiene el id de un rol por su nombre
 * @param {string} strRole
 * @returns {number|null}
 */
export const getCustomerRoleId = async (strRole) => {
  const sql = "SELECT id_role FROM roles WHERE name_role = $1";
  try {
    const result = await query(sql, [strRole]);
    return result.rows[0]?.id_role || null;
  } catch (error) {
    console.error("Error en getCustomerRoleId: ", error);
    throw new Error("Error al obtener el ID del rol");
  }
};

/**
 * Inserta un nuevo usuario
 * @returns {string} - id_u
 */
export const insertUser = async (
  email,
  hashedPassword,
  username,
  finalRoleId,
  isActive
) => {
  const sql = `
        INSERT INTO users(email, hashed_password, username, role_id, is_active) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id_u
    `;
  try {
    const result = await query(sql, [
      email,
      hashedPassword,
      username,
      finalRoleId,
      isActive,
    ]);
    return result.rows[0].id_u;
  } catch (error) {
    console.error("Error en insertUser: ", error);
    throw new Error("Error al insertar usuario");
  }
};

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
};

/**
 * Reactiva una cuenta y actualiza el último login
 * @returns {object|null}
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
};

/**
 * Elimina permanentemente una cuenta
 * @returns {object|null}
 */
export const deleteAccount = async (id_u) => {
  const sql = "DELETE FROM users WHERE id_u = $1 RETURNING id_u";
  try {
    const result = await query(sql, [id_u]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error en deleteAccount: ", error);
    throw new Error("Error al eliminar la cuenta del usuario");
  }
};

/**
 * Obtiene un usuario con sus permisos y rol
 * @param {string} id_u
 * @returns {object|null}
 */
export const getUserWithPermissions = async (id_u) => {
  const sql = `
        SELECT 
            u.id_u,
            u.username,
            u.email,
            u.is_active,
            r.id_role,
            r.name_role,
            r.description_role,
            COALESCE(string_agg(p.name_permission, ','), '') as permissions
        FROM users u
        JOIN roles r ON u.role_id = r.id_role
        LEFT JOIN role_permissions rp ON r.id_role = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id_permission
        WHERE u.id_u = $1 AND u.is_active = true
        GROUP BY u.id_u, r.id_role
    `;
  try {
    const result = await query(sql, [id_u]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    user.permissions = user.permissions ? user.permissions.split(",") : [];
    return user;
  } catch (error) {
    console.error("Error en getUserWithPermissions: ", error);
    throw new Error("Error al obtener usuario con permisos");
  }
};

/**
 * Autentica un usuario por email y contraseña, devolviendo sus permisos
 * @returns {object|null}
 */
export const authenticateUser = async (email, plainPassword) => {
  const sql = `
        SELECT 
            u.id_u,
            u.username,
            u.email,
            u.hashed_password,
            u.is_active,
            r.id_role,
            r.name_role,
            COALESCE(string_agg(p.name_permission, ','), '') as permissions
        FROM users u
        JOIN roles r ON u.role_id = r.id_role
        LEFT JOIN role_permissions rp ON r.id_role = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id_permission
        WHERE u.email = $1 AND u.is_active = true
        GROUP BY u.id_u, r.id_role
    `;

  try {
    const result = await query(sql, [email]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(
      plainPassword,
      user.hashed_password
    );
    if (!isValidPassword) return null;

    user.permissions = user.permissions ? user.permissions.split(",") : [];
    delete user.hashed_password;

    return user;
  } catch (error) {
    console.error("Error en authenticateUser: ", error);
    throw new Error("Error al autenticar usuario");
  }
};

/**
 * Verifica si un usuario tiene un permiso específico
 * @returns {boolean}
 */
export const hasPermission = async (id_u, permissionName) => {
  const sql = `
        SELECT COUNT(*) as count
        FROM users u
        JOIN roles r ON u.role_id = r.id_role
        JOIN role_permissions rp ON r.id_role = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id_permission
        WHERE u.id_u = $1 AND p.name_permission = $2 AND u.is_active = true
    `;
  try {
    const result = await query(sql, [id_u, permissionName]);
    return parseInt(result.rows[0].count, 10) > 0;
  } catch (error) {
    console.error("Error en hasPermission: ", error);
    throw new Error("Error al verificar permiso del usuario");
  }
};

/**
 * Actualizar perfil -> usuario, email, contraseña
 */

export const updateProfileUser = async (id_u, updates) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const key in updates) {
      fields.push(`${key} = $${idx}`);
      values.push(updates[key]);
      idx++;
    }

    values.push(id_u);
    const sql = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE id_u = $${idx}
            RETURNING id_u, email, username
        `;

    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error al actualizar el perfil: ", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
