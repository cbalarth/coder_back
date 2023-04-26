import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync())
};

const isValidPassword=(loginPassword, user)=>{
    return bcrypt.compareSync(loginPassword, user.password);
};

export {__filename, __dirname, createHash, isValidPassword};