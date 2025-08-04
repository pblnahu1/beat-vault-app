import {
  findUserByEmail,
  updateUserStatus,
  updateProfileUser,
  deleteAccount,
  reactivateUserAccount,
} from "../services/userService.js";
import { generateToken } from "../utils/generateToken.js";

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
  const {id: id_u} = req.params;
  const { email, username, password } = req.body;

  const result = await updateProfileUser(id_u, { email, username, password });
  if (result.success) {
    res.status(200).json(result.user);
  } else {
    res.status(400).json({ error: result.message });
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
