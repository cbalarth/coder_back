import {Router} from "express";
import passport from "passport";
import {createHash, isValidPassword} from "../../utils.js";
import userModel from "../../dao/models/userModel.js";

const authRouter = Router();

// SIGNUP
authRouter.post("/signup", passport.authenticate("localSignupStrategy",{
    failureRedirect:"/api/sessions/failure-signup"
}),(req, res)=>{
    res.send("Usuario registrado localmente y session iniciada.");
});

authRouter.get("/failure-signup", (req, res) => {
    res.send("No fue posible registrar el usuario.");
});

authRouter.get("/github", passport.authenticate("githubSignupStrategy"));

authRouter.get("/github-callback", passport.authenticate("githubSignupStrategy",{
    failureRedirect:"/api/sessions/failure-signup"
}), (req, res)=>{
    res.send("Usuario registrado a través de Github y session iniciada.")
});

// LOCAL LOGIN
authRouter.post("/login", passport.authenticate("localLoginStrategy",{
    failureRedirect:"/api/sessions/failure-login"
}), (req, res)=>{
    res.redirect("/products");
});

// FORGOT
authRouter.post("/forgot", async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email:email});
        if(user){
            user.password = createHash(password);
            const userUpdate = await userModel.findOneAndUpdate({email:user.email}, user, {new:true});
            res.send("Contraseña actualizada exitosamente.");
        } else {
            req.send("El usuario no está registrado.")
        }
    } catch (error) {
        res.send("No se pudo restaurar la contraseña.")
    }
});

// LOGOUT
authRouter.get("/logout",(req,res)=>{
    req.logOut(error => {
        if(error){
            return res.send("No se pudo cerrar la session.");
        }else {
            req.session.destroy(err=>{ //Elimina la session.
                if(err){
                    return res.send("No se pudo cerrar la session.");
                }
                console.log("LOGOUT: Session finalizada exitosamente.");
                res.redirect("/");
            });
        }
    });
});

export default authRouter;