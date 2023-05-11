import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from "passport-jwt";
import { options } from "./options.js";

const jwtStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {
    //Estrategia para autenticación a través de JWT.
    passport.use("authJWT", new jwtStrategy(
        {
            //extraer el token de la cookie
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: options.server.secretToken
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload)
            } catch (error) {
                return done(error);
            }
        }
    ));

    //Estrategia para autenticación a través de Github.
    // passport.use("githubSignupStrategy", new GithubStrategy(
    //     {
    //         callbackURL: "http://localhost:8080/api/sessions/github-callback",
    //         clientID: "Iv1.b78c65f5ab6c27a7",
    //         clientSecret: "1f06ac5f693df150e08f72ceeafc00c7fab7063d"
    //     },
    //     async(accessToken, refreshToken, profile, done)=>{
    //         try {
    //             console.log("profile", profile)
    //             const userExists = await userModel.findOne({email: profile.username});
    //             if(userExists){
    //                 return done(null, userExists)
    //             }
    //             const newUser = {
    //                 name: profile.displayName,
    //                 age: null,
    //                 email: profile.username,
    //                 password: createHash(profile.id) //Se inventa el password desde el ID de Github.
    //             };
    //             const userCreated = await userModel.create(newUser);
    //             return done(null,userCreated)
    //         } catch (error) {
    //             return done(error)
    //         }
    //     }
    // ));
}

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        //extraemos el token de la cookie
        token = req.cookies[options.server.cookieToken]
    }
    return token;
}