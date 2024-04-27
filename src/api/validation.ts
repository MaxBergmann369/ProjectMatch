import {User} from "./models";

export class ValUser {
    static isValid(ifId: string, username: string, firstname: string, lastname: string,
                   birthdate: Date, biografie: string, permissions: number, department: string): boolean {
        if(!this.isIFValid(ifId)) {
            return false;
        }

        if(username === undefined || username === "" || username.length > 20 || username.length < 4) {
            return false;
        }

        if(firstname === undefined || firstname === "" || firstname.length > 20 || firstname.length < 1) {
            return false;
        }

        if(lastname === undefined || lastname === "" || lastname.length > 20 || lastname.length < 1) {
            return false;
        }

        if(birthdate === undefined || !this.validateBirthdate(birthdate)) {
            return false;
        }

        if(permissions === undefined || permissions < 0) {
            return false;
        }

        if(department === undefined || department === "" || department.length > 20 || department.length < 1) {
            return false;
        }

        return !this.containsForbiddenWords(username, firstname, lastname);
    }


    private static isIFValid(ifId: string): boolean {
        if(ifId === undefined || ifId.length !== 8 || !ifId.startsWith("IF")) {
            return false;
        }

        return !isNaN(Number(ifId.substring(2)));
    }

    private static containsForbiddenWords(username: string, firstname: string, lastname: string): boolean {
        //TODO: Add more forbidden words from file
        let forbiddenWords: string[] = ["admin", "moderator", "user", "root", "guest", "login", "register", "password", "username", "firstname", "lastname", "email", "birthdate", "permissions"];

        return forbiddenWords.some(word => username.toLowerCase().includes(word)) || forbiddenWords.some(word => firstname.toLowerCase().includes(word)) || forbiddenWords.some(word => lastname.toLowerCase().includes(word));
    }

    private static validateBirthdate(birthdate: Date): boolean {
        if (birthdate === undefined || birthdate === null || birthdate.getFullYear() < new Date().getFullYear() - 100 || birthdate.getFullYear() > new Date().getFullYear() - 10){
            return false;
        }

        return !isNaN(birthdate.getTime());
    }
}
