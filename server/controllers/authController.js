import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  getCustomerRoleId,
  insertUser,
  reactivateUserAccount,
  roleCheckId,
  updateLastLogin,
  authenticateUser,
  saveRefreshToken
} from "../services/userService.js";

// 🔐 LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y Contraseña son requeridos.",
      });
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({
        message: "Usuario no encontrado o credenciales inválidas.",
      });
    }

    if (!user.is_active) {
      const reactivation = await reactivateUserAccount(user.id_u);

      const { accessToken, refreshToken } = generateToken({
        id_u: reactivation.id_u,
        email: reactivation.email,
        username: reactivation.username,
        role_id: user.id_role,
        permissions: user.permissions,
      });

      // Guardar refresh token en la BD
      await saveRefreshToken(reactivation.id_u, refreshToken);

      return res.status(200).json({
        message: "Tu cuenta estaba desactivada, se reactivó automáticamente.",
        reactivated: true,
        accessToken,
        refreshToken,
        user: {
          id_u: reactivation.id_u,
          email: reactivation.email,
          username: reactivation.username,
          role_id: user.id_role,
          role: user.name_role,
          permissions: user.permissions,
        },
      });
    }

    await updateLastLogin(user.id_u);

    const { accessToken, refreshToken } = generateToken({
      id_u: user.id_u,
      email: user.email,
      username: user.username,
      role_id: user.id_role,
      permissions: user.permissions,
    });

    // Guardar refresh token en la BD
    await saveRefreshToken(user.id_u, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id_u: user.id_u,
        email: user.email,
        username: user.username,
        role_id: user.id_role,
        role: user.name_role,
        permissions: user.permissions,
        last_login: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error en loginUser: ", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
// REGISTER
const registerUser = async (req, res) => {
  try {
    const { email, password, username, role_id } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    let finalRoleId = role_id;

    if (role_id) {
      const roleExists = await roleCheckId(role_id);
      if (!roleExists) {
        return res
          .status(400)
          .json({ message: "El rol seleccionado no existe" });
      }
    } else {
      const defaultRoleId = await getCustomerRoleId("customer");
      if (!defaultRoleId) {
        return res
          .status(500)
          .json({ message: "Rol por defecto no encontrado en la BD" });
      }
      finalRoleId = defaultRoleId;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await insertUser(
      email,
      hashedPassword,
      username,
      finalRoleId,
      true
    );

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: {
        id_u: userId,
        email,
        username,
        role_id: finalRoleId,
      },
    });
  } catch (error) {
    console.error("Error en registerUser: ", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export { loginUser, registerUser };
