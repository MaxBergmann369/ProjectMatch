
import {Database} from "./db";
import {ValProject, ValUser} from "./validation";
import {Ability, DirectChat, Like, Message, Notification, Project, ProjectMember, User, View} from "./models";

export class Utility {

    /* region User */

    /* region Base */
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
            if(!ValUser.isIFValid(ifId)) {
                return null;
            }

            const user = await Database.getUser(ifId);
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            return null;
        }
    }

    static async updateUser(ifId: string, username: string, firstname: string, lastname: string, birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            if(!ValUser.isValid(ifId, username, firstname, lastname, birthdate, biografie, permissions, department)) {
                return false;
            }

            return await Database.updateUser(ifId, username, firstname, lastname, birthdate.toDateString(), biografie, permissions, department);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteUser(ifId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(ifId)) {
                return false;
            }

            return await Database.deleteUser(ifId);
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
    static async addUserAbility(userId: string, abilityId: number): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || abilityId < 1) {
                return false;
            }

            return await Database.addUserAbility(userId, abilityId);
        }
        catch (e) {
            return false;
        }
    }

    static async getUserAbilities(userId: string): Promise<Ability[] | null> {
        try {
            if(!ValUser.isIFValid(userId)) {
                return null;
            }

            return await Database.getUserAbilitiesByUserId(userId);
        }
        catch (e) {
            return null;
        }
    }

    /* endregion */

    /* region Notification */

    static async addNotification(userId: string, title: string, text: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || title.length < 1 || title.length > 50 || text.length < 1 || text.length > 500) {
                return false;
            }

            return await Database.addNotification(userId, title, text, new Date(Date.now()).toDateString());
        }
        catch (e) {
            return false;
        }
    }

    static async getNotifications(userId: string): Promise<Notification[] | null> {
        try {
            if(!ValUser.isIFValid(userId)) {
                return null;
            }

            return await Database.getNotificationsByUserId(userId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteNotification(userId: string, notificationId: number): Promise<boolean> {
        try {
            if(!await this.isNotificationOwner(userId, notificationId)) {
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
            if(!ValUser.isIFValid(userId) || notificationId < 1) {
                return false;
            }

            return await Database.isNotificationOwner(userId, notificationId);
        }
        catch (e) {
            return false;
        }
    }

    /* endregion */

    /* region Project */

    /* region Base */
    static async addProject(name: string, ownerId: string, thumbnail: string, description: string, links: string, maxMembers: number): Promise<boolean> {
        try {
            const date = new Date(Date.now());

            if(!ValProject.isValid(name, ownerId, thumbnail, description, date, links, maxMembers) || await this.getAmountOfProjects(ownerId) >= 5){
                return false;
            }

            if(await this.alreadyProjectWithSameName(ownerId, name, 0)) {
                return false;
            }

            return await Database.addProject(name, ownerId, thumbnail, description, date.toDateString(), links, maxMembers);
        }
        catch (e) {
            return false;
        }
    }

    static async getProject(id: number): Promise<Project> {
        try {
            return await Database.getProject(id);
        }
        catch (e) {
            return null;
        }
    }

    static async getAmountOfProjects(ownerId:string): Promise<number> {
        try {
            return await Database.getAmountOfProjectsByOwnerId(ownerId);
        }
        catch (e) {
            return -1;
        }
    }

    static async updateProject(id: number, name: string, ownerId: string, thumbnail: string, description: string, links: string, maxMembers: number): Promise<boolean> {
        try {
            if(!ValProject.isValid(name, ownerId, thumbnail, description, new Date(Date.now()), links, maxMembers) || id < 1) {
                return false;
            }

            if(await this.alreadyProjectWithSameName(ownerId, name, id)) {
                return false;
            }

            return await Database.updateProject(id, name, ownerId, thumbnail, description, links, maxMembers);
        }
        catch (e) {
            return false;
        }
    }

    static async alreadyProjectWithSameName(ownerId: string, projectName: string, id: number): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(ownerId) || projectName.length < 1 || projectName.length > 30) {
                return false;
            }

            const projects = await Database.getProjectsByOwnerId(ownerId);

            for(const project of projects) {
                if(project.name === projectName && project.id !== id) {
                    return true;
                }
            }

            return false;
        }
        catch (e) {
            return false;
        }
    }

    static async deleteProject(userId: string, projectId: number): Promise<boolean> {
        try {
            if(!await this.isUserOwnerOfProject(userId, projectId)) {
                return false;
            }

            return await Database.deleteProject(projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteProjectByName(projectName: string, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || projectName.length < 1 || projectName.length > 30) {
                return false;
            }

            const projectId = await this.getProjectId(userId, projectName);

            if (projectId === null) {
                return false;
            }

            return await this.deleteProject(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async isUserOwnerOfProject(userId: string, projectId: number): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || projectId < 1) {
                return false;
            }

            return await Database.isUserOwnerOfProject(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getProjectId(ownerId: string, projectName: string): Promise<number | null> {
        try {
            if(!ValUser.isIFValid(ownerId)) {
                return null;
            }

            return await Database.getProjectIdBy(ownerId, projectName);
        }
        catch (e) {
            return null;
        }
    }

    static async getProjects(): Promise<Project[] | null> {
        try {
            return await Database.getProjects();
        }
        catch (e) {
            return null;
        }
    }
    /* endregion */

    /* region ProjectMember */
    static async addProjectMember(projectId: number, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            return await Database.addProjectMember(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getProjectMembers(projectId: number): Promise<ProjectMember[] | null> {
        try {
            return await Database.getProjectMembersByProjectId(projectId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteProjectMember(projectId: number, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId)) {
                return false;
            }

            return await Database.deleteProjectMember(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }
    /* endregion */

    /* region Like */
    static async addLike(projectId: number, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            return await Database.addLike(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getLikes(projectId: number): Promise<Like[]> {
        try {
            return await Database.getLikesByProjectId(projectId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteLike(projectId: number, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId)) {
                return false;
            }

            return await Database.deleteLike(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    /* endregion */

    /* region View */
    static async addView(projectId: number, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            return await Database.addView(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getViews(projectId: number): Promise<View[]> {
        try {
            return await Database.getViewsByProjectId(projectId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteViews(projectId: number): Promise<boolean> {
        try {
            return await Database.deleteViewsByProjectId(projectId);
        }
        catch (e) {
            return false;
        }
    }
    /* endregion */

    /* region ProjectAbility */
    static async addProjectAbility(projectId: number, abilityId: number): Promise<boolean> {
        try {
            if(abilityId < 1 || projectId < 1 || await Database.getProject(projectId) === null || await Database.getAbilityById(abilityId) === null){
                return false;
            }

            return await Database.addProjectAbility(projectId, abilityId);
        }
        catch (e) {
            return false;
        }
    }

    static async getAbilitiesByProjectId(projectId: number): Promise<Ability[]> {
        try {
            return await Database.getProjectAbilitiesByProjectId(projectId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteAbilityFromProject(projectId: number, abilityId: number): Promise<boolean> {
        try {
            return await Database.deleteProjectAbility(projectId, abilityId);
        }
        catch (e) {
            return false;
        }
    }
    /* endregion */

    /* endregion */

    /* region DirectChat */

    /* region Chat */

    static async addDirectChat(userId: string, otherUserId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || !ValUser.isIFValid(otherUserId)) {
                return false;
            }

            const chat = await Database.getDirectChatByUserIds(userId, otherUserId);

            if(chat !== null) {
                return false;
            }

            return await Database.addDirectChat(userId, otherUserId);
        }
        catch (e) {
            return false;
        }
    }

    static async getDirectChats(userId: string): Promise<DirectChat[]> {
        try {
            if(!ValUser.isIFValid(userId)) {
                return null;
            }

            return await Database.getDirectChatsByUserId(userId);
        }
        catch (e) {
            return null;
        }
    }

    static async getDirectChat(userId: string, otherUserId: string): Promise<DirectChat | null> {
        try {
            if(!ValUser.isIFValid(userId) || !ValUser.isIFValid(otherUserId)) {
                return null;
            }

            return await Database.getDirectChatByUserIds(userId, otherUserId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteDirectChat(userId: string, otherUserId: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || !ValUser.isIFValid(otherUserId)) {
                return false;
            }

            const chat = await Database.getDirectChatByUserIds(userId, otherUserId);

            if(chat === null || chat.userId !== userId || chat.otherUserId !== otherUserId) {
                return false;
            }

            return await Database.deleteDirectChat(chat.id);
        }
        catch (e) {
            return false;
        }
    }

    /* endregion */

    /* region Message */

    static async addMessage(chatId: number, userId: string, message: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || message.length < 1 || message.length > 500) {
                return false;
            }

            return await Database.addMessage(chatId, userId, message, new Date(Date.now()).toDateString());
        }
        catch (e) {
            return false;
        }
    }

    static async getMessages(chatId: number): Promise<Message[]> {
        try {
            return await Database.getMessagesByChatId(chatId);
        }
        catch (e) {
            return null;
        }
    }

    static async updateMessage(messageId: number, chatId: number, userId: string, message: string): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || messageId < 1 || chatId < 1 || message.length < 1 || message.length > 500) {
                return false;
            }

            return await Database.updateMessage(messageId, chatId, userId, message);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteMessage(userId: string, messageId: number): Promise<boolean> {
        try {
            if(!ValUser.isIFValid(userId) || messageId < 1) {
                return false;
            }

            return await Database.deleteMessage(messageId);
        }
        catch (e) {
            return false;
        }
    }

    /* endregion */

    /* endregion */

    /* region Ability */
        static async addAbility(name: string, parentId: number | null): Promise<boolean> {
            try {
                return await Database.addAbility(name, parentId);
            } catch (e) {
                return false;
            }
        }

    /* endregion */
}