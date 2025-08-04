import {
  findUserByEmail,
  updateUserStatus,
  updateProfileUser,
  deleteAccount,
  reactivateUserAccount,
  findUserById,
} from "../services/userService.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * 
 */
export const getProfileUser = async(req,res)=>{
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Ocurrió un error al recuperar los headers de autorización y el token"
      })
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id_u); //id del token
    if(!user) return res.status(404).json({message: "Usuario no encontrado"})

    // envio dato relevante
    return res.json({
      id_u: user.id_u,
      username: user.username,
      email: user.email,
      token,
      role_id: user.role_id
    });
  } catch (error) {
      console.error(error);
      return res.status(401).json({
        message: error.message
      })
  }
}

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

// UPDATE PROFILE (email, username, password)
const updateUserController = async (req, res) => {
  const { id } = req.params;
  const { email, username, password } = req.body;

  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const updates = {};

    if (email && email !== user.email) updates.email = email;
    if (username && username !== user.username) updates.username = username;
    if (password) updates.hashed_password = await bcrypt.hash(password, 10);

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ message: "No hay cambios para aplicar" });

    const updatedUser = await updateProfileUser(id, updates);

    return res.json({
      message: "Perfil actualizado correctamente",
      data: {
        id_u: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username
      }
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
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
      return res
        .status(404)
        .json({ message: "Usuario no encontrado o ya eliminado" });
    }

    res.status(200).json({ message: "Cuenta eliminada definitivamente" });
  } catch (error) {
    console.error("Error en deleteAccountForever: ", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export {
  getUserIdByEmail,
  pausedAccountAndLogout,
  updateUserController,
  reactivateAccount,
  deleteAccountForever,
};
