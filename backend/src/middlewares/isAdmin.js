export const isAdmin = (req, res, next) => {
    if (req.user?.userType !== "admin") {
        return res.status(403).json({
            message: "Acceso denegado: se requiere rol de administrador",
        });
    }

    next();
};