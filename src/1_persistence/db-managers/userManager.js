export class userManager {
    constructor(model) {
        this.model = model;
        console.log("USERMANAGER.JS | USERS Connected DB");
    };

    //ADD USER
    addUser = async (user) => {
        try {
            const data = await this.model.create(user);
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`ERROR ADDING NEW USER: ${error.message}`);
        }
    };

    //GET USER BY EMAIL
    getUserByEmail = async (email) => {
        try {
            const data = await this.model.findOne({ email: email });
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(`ERROR FINDING USER: ${error.message}`);
        }
    };
}