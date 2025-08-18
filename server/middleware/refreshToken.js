import jwt from "jsonwebtoken";
import {
  findUserById,
  getRefreshToken,
  saveRefreshToken,
} from "../services/userService.js";
import { generateToken } from "../utils/generateToken.js";

export const refreshToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);

    const user = await findUserById(payload.id_u);
    const savedToken = await getRefreshToken(user.id_u);

    if (!user || savedToken !== token) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefresh } = generateToken({
      id_u: user.id_u,
      email: user.email,
      username: user.username,
      role_id: user.id_role,
    });

    await saveRefreshToken(user.id_u, newRefresh);

    res.json({ accessToken, refreshToken: newRefresh });
  } catch (error) {
    next(error);
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};
