// middleware para verificar permisos
import { hasPermission } from "../services/userService.js";

export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const hasP = await hasPermission(req.user.id_u, permission);
      
      if (!hasP) {
        return res.status(403).json({ 
          error: 'No tienes permisos para realizar esta acción',
          requiredPermission: permission 
        });
      }
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error verificando permisos' });
    }
  };
};