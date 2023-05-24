export class GetUserDto {
    constructor(userDB) {
        this.first_name = userDB.first_name;
        this.last_name = userDB.last_name;
        this.email = userDB.email;
        this.role = userDB.role;
    }
};