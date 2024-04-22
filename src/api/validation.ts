import bcrypt from 'bcrypt';
import {User} from "./models";

export class ValUser {
    static isValid(user: User): boolean {
        if(user.username === undefined || user.username === "" || user.username.length > 20) {
            return false;
        }

        if(user.firstname === undefined || user.firstname === "" || user.firstname.length > 20) {
            return false;
        }

        if(user.lastname === undefined || user.lastname === "" || user.lastname.length > 20) {
            return false;
        }

        if(user.birthdate === undefined || !this.validateBirthdate(user.birthdate)) {
            return false;
        }

        if(user.email === undefined || !this.validateEmail(user.email)) {
            return false;
        }

        if(user.password === undefined || user.password === "" || user.password.length < 8) {
            return false;
        }

        if(user.permissions === undefined || user.permissions < 0) {
            return false;
        }

        return !this.containsForbiddenWords(user.username, user.firstname, user.lastname);
    }

    private static containsForbiddenWords(username: string, firstname: string, lastname: string): boolean {
        //TODO: Add more forbidden words from file
        let forbiddenWords: string[] = ["admin", "moderator", "user", "root", "guest", "login", "register", "password", "username", "firstname", "lastname", "email", "birthdate", "permissions"];

        return forbiddenWords.some(word => username.includes(word)) || forbiddenWords.some(word => firstname.includes(word)) || forbiddenWords.some(word => lastname.includes(word));
    }

    private static validateBirthdate(birthdate: Date): boolean {
        if (birthdate === undefined) {
            return false;
        }

        return !isNaN(birthdate.getTime());
    }

    private static validateEmail(email: string): boolean {
        let regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email.match(regexPattern)) {
            return false;
        }

        return true;
    }

    static async encryptPassword(password: string): Promise<string> {
        const saltRounds = 10; // Number of salt rounds for bcrypt

        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the salt
        return await bcrypt.hash(password, salt);
    }
}
