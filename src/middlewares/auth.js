import passport from "passport";

const checkAuthenticated = (req, res, next) => {
    passport.authenticate("authJWT", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ status: "error", error: "Usuario no logueado (auth.js / auth)." });
        }
        req.user = user;
        next();
    })(req, res, next);
};

const checkRole = (allowedRoles) => (req, res, next) => {
    passport.authenticate("authJWT", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ status: "error", error: "Usuario no logueado (auth.js / role)." });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).send({ status: "error", error: "Usuario no autorizado (auth.js / role)." });
        }
        req.user = user;
        next();
    })(req, res, next);
};

export { checkAuthenticated, checkRole };