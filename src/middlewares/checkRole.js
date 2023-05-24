import passport from "passport";

export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        passport.authenticate("authJWT", { session: false }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).send({ message: "Usuario no logueado (internal code: 3)" });
            }
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).send({ message: "Usuario no autorizado" });
            }
            next();
        })(req, res, next);
    };
};