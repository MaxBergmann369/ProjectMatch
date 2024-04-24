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
}
