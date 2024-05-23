import jwt from "jsonwebtoken";
import {TokenUser} from "../../website/scripts/tokenUser";
import {KeycloakTokenParsed} from "keycloak-js";
import {UserUtility} from "./utility/user-utility";

enum DepartmentTypes {
    Unset = "Unknown",
    AD = "Abendschule",
    BG = "Biomedizin- und Gesundheitstechnik",
    FE = "Fachschule Elektronik",
    HE = "Höhere Elektronik",
    IF = "Informatik",
    IT = "Medientechnik"
}

export class ValUser {
    static isValid(userId: string, username: string, firstname: string, lastname: string, email:string, clazz:string,
                   birthdate: Date, biografie: string, permissions: number, department: string): boolean {
        if(!this.isUserIdValid(userId)) {
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

        if(department === undefined || department === "" || !this.validateDepartment(department)) {
            return false;
        }

        if(email === undefined || !this.isEmailValid(email)) {
            return false;
        }

        if(clazz === undefined || clazz === "" || clazz.length > 10 || clazz.length < 1) {
            return false;
        }

        return !this.containsForbiddenWords(username, firstname, lastname);
    }


    static isUserIdValid(userId: string): boolean {

        if(userId === undefined || userId === null || userId.length !== 8) {
            return false;
        }

        const id = userId.toLowerCase();
        if(!Object.keys(DepartmentTypes).some(value => id.startsWith(value.toLowerCase()))) {
            return false;
        }

        return !isNaN(Number(id.substring(2)));
    }

    static async isUserValid(userId: string) {
        if(!this.isUserIdValid(userId)) {
            return false;
        }

        const user = await UserUtility.getUser(userId);

        return user !== null;
    }

    private static isEmailValid(email: string): boolean {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    private static containsForbiddenWords(username: string, firstname: string, lastname: string): boolean {
        //TODO: Add more forbidden words from file
        const forbiddenWords: string[] = ["admin", "moderator", "user", "root", "guest", "login", "register", "password", "username", "firstname", "lastname", "email", "birthdate", "permissions"];

        if(!checkInvalidCharsExp(username) || !checkInvalidChars(firstname) || !checkInvalidChars(lastname)) {
            return true;
        }

        return forbiddenWords.some(word => username.toLowerCase().includes(word)) || forbiddenWords.some(word => firstname.toLowerCase().includes(word)) || forbiddenWords.some(word => lastname.toLowerCase().includes(word));
    }

    private static validateBirthdate(birthdate: Date): boolean {
        if (birthdate === undefined || birthdate === null || birthdate.getFullYear() < new Date().getFullYear() - 100 || birthdate.getFullYear() > new Date().getFullYear() - 10){
            return false;
        }

        return !isNaN(birthdate.getTime());
    }

    private static validateDepartment(department: string): boolean {
        return Object.values(DepartmentTypes).some(value => department.toLowerCase() === value.toLowerCase());
    }
}

export class ValProject {
    static isValid(name: string, ownerId: string, thumbnail: string, description: string, dateOfCreation: Date, links: string, maxMembers: number): boolean {

        if(name === undefined || name === "" || name.length > 30 || name.length < 1 || !checkInvalidChars(name)) {
            return false;
        }

        if(!ValUser.isUserValid(ownerId)){
            return false;
        }

        if(thumbnail === undefined || thumbnail === "" || thumbnail.length > 20 || thumbnail.length < 1) {
            return false;
        }

        if(description === undefined || description === "" || description.length > 1000 || description.length < 1 || !checkInvalidCharsExp(description)) {
            return false;
        }

        if(dateOfCreation === undefined || !this.validateDate(dateOfCreation)) {
            return false;
        }

        if(links.length > 1000 || links.length < 0) {
            return false;
        }

        return !(maxMembers === undefined || maxMembers < 1 || maxMembers > 10);
    }

    private static validateDate(date: Date): boolean {
        if (date === undefined || date === null || date.getFullYear() < 2000 || date.getFullYear() > new Date().getFullYear()){
            return false;
        }

        return !isNaN(date.getTime());
    }
}

export class ValNotification {
    static isValid(userId: string, title: string, text: string): boolean {
        if(!ValUser.isUserIdValid(userId)){
            return false;
        }

        if(title === undefined || title === "" || title.length > 50 || title.length < 1 || !checkInvalidCharsExp(title)) {
            return false;
        }

        return !(text === undefined || text === "" || text.length > 500 || text.length < 1 || !checkInvalidCharsExp(text));
    }
}

export class ValMessage {
    static isValid(senderId: string, message: string): boolean {
        if (!ValUser.isUserIdValid(senderId)) {
            return false;
        }

        if (message === undefined || message === "" || message.length > 500 || message.length < 1) {
            return false;
        }

        return !this.containsForbiddenWords(message);
    }

    private static containsForbiddenWords(message: string): boolean {
        const forbiddenWords: string[] = ["admin", "moderator", "user", "root", "guest", "login", "register", "password", "username", "firstname", "lastname", "email", "birthdate", "permissions"];

        if(!checkInvalidCharsChat(message)) {
            return true;
        }

        return forbiddenWords.some(word => message.toLowerCase().includes(word));
    }
}

export function checkInvalidChars(str: string): boolean {
    const pattern = /[a-zA-ZöäüÖÄÜ]+/;
    return pattern.test(str);
}

export function checkInvalidCharsExp(str: string): boolean {
    const pattern = /[a-zA-ZöäüÖÄÜ0-9]+/;
    return pattern.test(str);
}

export function checkInvalidCharsChat(str: string): boolean {
    const pattern = /[a-zA-ZöäüÖÄÜß0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    return pattern.test(str);
}

export class EndPoints {
    static getToken(authHeader: string): TokenUser | null {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.split(" ")[1];

        const decodedToken: KeycloakTokenParsed = jwt.decode(token) as KeycloakTokenParsed;
        if (!decodedToken) {
            return null;
        }

        return new TokenUser(decodedToken);
    }
}
