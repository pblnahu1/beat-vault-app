import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import {
  deleteAccount,
  findUserByEmail,
  getCustomerRoleId,
  insertUser,
  reactivateUserAccount,
  roleCheckId,
  updateLastLogin,
  updateUserStatus,
  authenticateUser
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
      const token = generateToken({
        id_u: reactivation.id_u,
        email: reactivation.email,
        username: reactivation.username,
        role_id: user.id_role,
        permissions: user.permissions,
      });

      return res.status(200).json({
        message: "Tu cuenta estaba desactivada, se reactivó automáticamente.",
        reactivated: true,
        token,
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

    const token = generateToken({
      id_u: user.id_u,
      email: user.email,
      username: user.username,
      role_id: user.id_role,
      permissions: user.permissions,
    });

    res.status(200).json({
      success: true,
      token,
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
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    let finalRoleId = role_id;

    if (role_id) {
      const roleExists = await roleCheckId(role_id);
      if (!roleExists) {
        return res.status(400).json({ message: "El rol seleccionado no existe" });
      }
    } else {
      const defaultRoleId = await getCustomerRoleId("customer");
      if (!defaultRoleId) {
        return res.status(500).json({ message: "Rol por defecto no encontrado en la BD" });
      }
      finalRoleId = defaultRoleId;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await insertUser(email, hashedPassword, username, finalRoleId, true);

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

// GET USER ID BY EMAIL
const getUserIdByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email es requerido" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ id_u: user.id_u });
  } catch (error) {
    console.error("Error en getUserIdByEmail: ", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// PAUSE ACCOUNT
const pausedAccountAndLogout = async (req, res) => {
  try {
    const { id_u } = req.body;

    if (!id_u) {
      return res.status(400).json({
        message: "ID de usuario requerido para pausar la cuenta",
      });
    }

    await updateUserStatus(id_u);

    res.status(200).json({ message: "Cuenta pausada (usuario inactivo)." });
  } catch (error) {
    console.error("Error en pausedAccountAndLogout: ", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// REACTIVATE ACCOUNT
const reactivateAccount = async (req, res) => {
  try {
    const { id_u } = req.body;

    if (!id_u) {
      return res.status(400).json({
        message: "ID de usuario requerido para reactivar la cuenta",
      });
    }

    const user = await reactivateUserAccount(id_u);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = generateToken({
      id_u: user.id_u,
      email: user.email,
      username: user.username,
      role_id: user.role_id,
    });

    res.status(200).json({
      message: "Cuenta reactivada exitosamente.",
      token,
      user,
    });
  } catch (error) {
    console.error("Error en reactivateAccount: ", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// DELETE ACCOUNT
const deleteAccountForever = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ID de usuario requerido para eliminar la cuenta",
      });
    }

    const deleted = await deleteAccount(id);
    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado o ya eliminado" });
    }

    res.status(200).json({ message: "Cuenta eliminada definitivamente" });
  } catch (error) {
    console.error("Error en deleteAccountForever: ", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export {
  loginUser,
  registerUser,
  pausedAccountAndLogout,
  reactivateAccount,
  deleteAccountForever,
  getUserIdByEmail,
};
