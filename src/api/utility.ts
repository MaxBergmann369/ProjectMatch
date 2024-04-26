
import {Database} from "./db";
import {ValUser} from "./validation";
import {User} from "./models";

export class Utility {

    /* start region User */
    static async addUser(ifId: string, username: string, firstname: string, lastname: string,
                   birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            if (!ValUser.isValid(ifId, username, firstname, lastname, birthdate, biografie, permissions, department)) {
                return false;
            }

            return await Database.addUser(ifId, username, firstname, lastname, birthdate.toDateString(), biografie, permissions, department);
        }
        catch (e) {
            return false;
        }
    }

    static async getUser(ifId: string): Promise<User | null> {
        try {
            return await Database.getUser(ifId);
        }
        catch (e) {
            return null;
        }
    }

    static async updateUser(ifId: string, username: string, firstname: string, lastname: string, birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            return await Database.updateUser(ifId, username, firstname, lastname, birthdate.toDateString(), biografie, permissions, department);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteUser(ifId: string): Promise<boolean> {
        try {
            return await Database.deleteUser(ifId);
        }
        catch (e) {
            return false;
        }
    }

    static async getUsers(): Promise<User[]> {
        try {
            return await Database.getUsers();
        }
        catch (e) {
            return null;
        }
    }


    /* end region User */
}