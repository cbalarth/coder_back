import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { Faker, en } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync())
};

const isValidPassword = (loginPassword, user) => {
    return bcrypt.compareSync(loginPassword, user.password);
};

//FAKER MOCKING

export const customFaker = new Faker({
    locale: [en],
});

const { commerce, image, database, string } = customFaker;

const generateMockingProduct = () => {
    return {
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        code: string.alphanumeric(10),
        price: parseFloat(commerce.price()),
        status: true,
        stock: parseInt(string.numeric(2)),
        category: commerce.department(),
        thumbnails: [image.url(), image.url()]
    }
}

export { __filename, __dirname, createHash, isValidPassword, generateMockingProduct };