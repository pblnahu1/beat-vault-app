// middleware para verificar rol
export const requireRole = (roleName) => {
    return (req, res, next) => {
        if(req.user.name_role !== roleName){
            return res.status(403).json({
                error: "No tienes el rol necesario para esta acción",
                requiredRole: roleName,
            })
        }
        next();
    }
}

// por ejemplo
// router.delete("/user/:id", requireRole("admin"), deleteUser);