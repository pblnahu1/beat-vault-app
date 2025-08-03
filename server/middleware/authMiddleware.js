// protege rutas (verifica jwt)

import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const ensureToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // bearer <token> !!! importante

  if (!token) {
    return res.status(401).json({
      message: "Acceso denegado, token no proporcionado",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token no válido o expirado" });
    next(error);
  }
};

export default ensureToken;
