import { generateToken } from "../utils/generateToken.js";
import { query } from "../config/db.js";
import bcrypt from "bcryptjs";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Datos recibidos en Login: ", { email, password });

    if (!email || !password) {
      console.log("Falta agregar tu email o la contraseña en la solicitud.");
      return res.status(400).json({
        message: "Email y Contraseña son requeridos.",
      });
    }

    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    console.log("Resultado de la consulta: ", result.rows);

    if (result.rows.length === 0) {
      console.log("Usuario no encontrado");
      return res.status(401).json({
        message: "Usuario no encontrado",
      });
    }

    const user = result.rows[0];

    // verifico si el usuario está activo
    if (!user.is_active) {
      console.log("Usuario inactivo");
      return res.status(403).json({ message: "Tu cuenta está desactivada" });
    }

    console.log("Contraseña encriptada en BD: ", user.hashed_password);

    // verifico passsword
    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashed_password
    );
    console.log("¿Contraseña válida?: ", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    // query para actualizar el last_login
    await query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id_u = $1",
      [user.id_u]
    );

    const payload = {
      id_u: user.id_u,
      email: user.email,
      username: user.username,
      role_id: user.role_id,
    };

    // genero el token y envio respuesta
    const token = generateToken(payload);

    console.log("Login exitoso, token generado");

    res.status(200).json({
      success: true,
      token,
      user: {
        id_u: user.id_u,
        email: user.email,
        username: user.username,
        role_id: user.role_id,
        last_login: new Date().toISOString(), // o se puede devolver el actual desde la BD
      },
    });
  } catch (error) {
    console.error("Error en el servidor: ", error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password, username, role_id } = req.body;

    console.log("Datos recibidos en el registro: ", {
      email,
      password,
      username,
      role_id,
    });

    if (!email || !password || !username) {
      console.log("Faltan datos para el registro");
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    // verifico si el usuario ya existe
    const userExists = await query("SELECT email FROM users WHERE email = $1", [
      email,
    ]);
    if (userExists.rows.length > 0) {
      console.log("El usuario ya existe: ", email);
      return res.status(400).json({
        message: "El usuario ya está registrado",
      });
    }

    // verifico si el role_id existe
    let finalRoleId = role_id;

    if (role_id) {
      const roleCheck = await query(
        "SELECT id_role FROM roles WHERE id_role = $1",
        [role_id]
      );
      if (roleCheck.rows.length === 0) {
        return res
          .status(400)
          .json({ message: "El rol seleccionado no existe" });
      }
    } else {
      // obtengo el ID del rol "customer"
      const defaultRole = await query(
        "SELECT id_role FROM roles WHERE name_role = $1",
        ["customer"]
      );
      if (defaultRole.rows.length === 0) {
        return res
          .status(500)
          .json({ message: "Rol por defecto no encontrado en la BD" });
      }
      finalRoleId = defaultRole.rows[0].id_role;
    }

    // hasheo contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Contraseña hasheada correctamente");

    await query(
      "INSERT INTO users(email, hashed_password, username, role_id, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id_u",
      [email, hashedPassword, username, finalRoleId, true] // 2 = customer
    );

    console.log("Usuario creado con éxito");

    res.status(201).json({
      message: "Usuario creado con éxito",
    });
  } catch (error) {
    console.error("Error en el servidor: ", error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

const pausedAccountAndLogout = async (req, res, next) => {
  try {
    const { id_u } = req.body;

    if (!id_u) {
      return res.status(400).json({
        message: "ID de usuario requerido para pausar la cuenta",
      });
    }

    // actalizo el estado del usuairo
    await query("UPDATE users SET is_active = false WHERE id_u = $1", [id_u]);
    console.log(`Usuario ${id_u} desactivado correctamente.`);

    return res.status(200).json({ message: "Cuenta pausada (usuario inactivo)." });
  } catch (error) {
    console.error("Error en Pausar Cuenta: ", error);
    res.status(500).json({ message: "Error en Pausar Cuenta" });
    next(error);
  }
};

export { loginUser, registerUser, pausedAccountAndLogout };
