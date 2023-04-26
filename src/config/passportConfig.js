import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import userModel from "../dao/models/userModel.js";
import {createHash, isValidPassword} from "../utils.js";

const initializedPassport = ()=>{
    //Estrategia para autenticación local.
    passport.use("localSignupStrategy", new LocalStrategy(
        {
            usernameField: "email", //Se utiliza el nombre del input del formulario.
            passReqToCallback: true
        },
        async(req, username, password, done)=>{
            try {
                const {name, age} = req.body;
                const user = await userModel.findOne({email: username});
                if(user){ //Si existe el usuario en la db.
                    return done(null, false)
                }
                //Si no existe el usuario en la db.
                const newUser ={
                    name,
                    age,
                    email: username,
                    password: createHash(password)
                };
                const userCreated = await userModel.create(newUser);
                return done(null, userCreated);
            } catch (error) {
                return done(error);
            }
        }
    ));

    //Estrategia para autenticación a través de Github.
    passport.use("githubSignupStrategy", new GithubStrategy(
        {
            callbackURL: "http://localhost:8080/api/sessions/github-callback",
            clientID: "Iv1.b78c65f5ab6c27a7",
            clientSecret: "1f06ac5f693df150e08f72ceeafc00c7fab7063d"
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                console.log("profile", profile)
                const userExists = await userModel.findOne({email: profile.username});
                if(userExists){
                    return done(null, userExists)
                }
                const newUser = {
                    name: profile.displayName,
                    age: null,
                    email: profile.username,
                    password: createHash(profile.id) //Se inventa el password desde el ID de Github.
                };
                const userCreated = await userModel.create(newUser);
                return done(null,userCreated)
            } catch (error) {
                return done(error)
            }
        }
    ));

    //Estrategia para login local.
    passport.use("localLoginStrategy", new LocalStrategy(
        {
            usernameField: "email"
        },
        async (username, password, done)=>{
            try {
                const user = await userModel.findOne({email: username});
                if(!user){
                    return done(null, false);
                }
                if(!isValidPassword(password, user)) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    //Serializar usuarios.
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    //Deserializar usuarios.
    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id);
        return done(null, user); //req.user = user
    });
}

export {initializedPassport};