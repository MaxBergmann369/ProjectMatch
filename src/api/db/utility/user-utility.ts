import {Database} from "../db";
import {checkInvalidChars, ValNotification, ValUser} from "../validation";
import {Ability, Notification, User} from "../../../models";

export class UserUtility {
    /* region Base */
    static async addUser(userId: string, username: string, firstname: string, lastname: string, pfp: string, email:string, clazz:string,
                         birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if (!ValUser.isValid(id, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department)) {
                return false;
            }

            return await Database.addUser(id, username, firstname, lastname, pfp, email, clazz, birthdate.toDateString(), biografie, permissions, department);
        }
        catch (e) {
            return false;
        }
    }

    static async getUser(userId: string): Promise<User | null> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return null;
            }

            const user = await Database.getUser(id);
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            return null;
        }
    }

    static async getFullNameByUserId(userId: string): Promise<string | null> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return null;
            }

            return Database.getFullNameByUserId(id);
        } catch (e) {
            return null;
        }
    }

    static async getTop10UserMatching(fullName:string) {
        const names = fullName.split("-");

        if(fullName.length < 1 || fullName.length > 40) {
            return null;
        }

        return await Database.getTop10UserMatching(names[0], names[1]);
    }

    static async getUserIdByFullName(fullName: string): Promise<string | null> {
        try {
            const names = fullName.split("-");

            if(fullName.length < 1 || fullName.length > 40 || names.length !== 2 || names[0].length < 1 || names[1].length < 1 || !checkInvalidChars(names[0]) || !checkInvalidChars(names[1])) {
                return null;
            }

            const userId = await Database.getUserIdByFullName(names[0], names[1]);

            return userId === null ? null : userId;
        }
        catch (e) {
            return null;
        }
    }

    static async updateUser(userId: string, username: string, firstname: string, lastname: string, pfp:string, email:string, clazz:string, birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isValid(id, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department)) {
                return false;
            }

            return await Database.updateUser(id, username, firstname, lastname, pfp, email, clazz, birthdate.toDateString(), biografie, permissions, department);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteUser(userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return false;
            }

            return await Database.deleteUser(id);
        }
        catch (e) {
            return false;
        }
    }

    static async getUsers(): Promise<User[] | null> {
        try {
            return await Database.getUsers();
        }
        catch (e) {
            return null;
        }
    }

    /* endregion */

    /* region UserAbility */
    static async addUserAbilities(userId: string, abilityIds: number[]): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!(await ValUser.isUserValid(id)) || abilityIds.length < 1) {
                return false;
            }

            const abilities = await Database.getUserAbilitiesByUserId(id);

            const newAbilities = abilityIds.filter(abilityId => !abilities.some(ability => ability.id === abilityId));

            if(newAbilities.length < 1) {
                return false;
            }

            return await Database.addUserAbilities(id, newAbilities);
        }
        catch (e) {
            return false;
        }
    }

    static async getUserAbilities(userId: string): Promise<Ability[] | null> {
        try {
            const id = userId.toLowerCase();

            if(!(await ValUser.isUserValid(id))) {
                return null;
            }

            return await Database.getUserAbilitiesByUserId(id);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteUserAbility(userId: string, abilityId: number): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            return await Database.deleteUserAbility(id, abilityId);
        }
        catch (e) {
            return false;
        }
    }

    /* endregion */

    /* region Notification */

    static async addNotification(userId: string, title: string, text: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValNotification.isValid(id, title, text)) {
                return false;
            }

            if(!(await ValUser.isUserValid(id))) {
                return false;
            }

            const date = new Date(Date.now());

            const dateTime = `${date.toLocaleDateString()};${date.toLocaleTimeString()}`;

            return await Database.addNotification(id, title, text, dateTime);
        }
        catch (e) {
            return false;
        }
    }

    static async getNotifications(userId: string): Promise<Notification[] | null> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return null;
            }

            return await Database.getNotificationsByUserId(id);
        }
        catch (e) {
            return null;
        }
    }

    static async notificationsSeen(userId:string, notificationId:number): Promise<boolean> {
        try {
            return await Database.notificationSeen(userId, notificationId);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteNotification(userId: string, notificationId: number): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!await this.isNotificationOwner(id, notificationId)) {
                return false;
            }

            return await Database.deleteNotification(notificationId);
        }
        catch (e) {
            return false;
        }
    }

    static async isNotificationOwner(userId: string, notificationId: number): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || notificationId < 1) {
                return false;
            }

            return await Database.isNotificationOwner(id, notificationId);
        }
        catch (e) {
            return false;
        }
    }

    /* endregion */

    /* region Ability */
    static async addAbility(name: string, parentId: number | null): Promise<boolean> {
        try {
            return await Database.addAbility(name, parentId);
        } catch (e) {
            return false;
        }
    }

    static async getAllAbilities(): Promise<Ability[]> {
        try {
            return await Database.getAbilities();
        }
        catch (e) {
            return null;
        }
    }

    /* endregion */
}