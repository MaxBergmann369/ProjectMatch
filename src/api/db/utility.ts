
import {Database} from "./db";
import {ValMessage, ValNotification, ValProject, ValUser} from "./validation";
import {Ability, DirectChat, Like, Message, Notification, Project, ProjectMember, User, View} from "../../models";

export class Utility {

    /* region User */

    /* region Base */
    static async addUser(userId: string, username: string, firstname: string, lastname: string, email:string, clazz:string,
                   birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            if (!ValUser.isValid(userId, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department)) {
                return false;
            }

            return await Database.addUser(userId.trim(), username.trim(), firstname.trim(), lastname.trim(), email.trim(), clazz.trim(), birthdate.toDateString(), biografie.trim(), permissions, department.trim());
        }
        catch (e) {
            throw new Error(e);
            return false;
        }
    }

    static async getUser(userId: string): Promise<User | null> {
        try {
            if(!ValUser.isUserIdValid(userId)) {
                return null;
            }

            const user = await Database.getUser(userId);
            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            return null;
        }
    }

    static async updateUser(userId: string, username: string, firstname: string, lastname: string, email:string, clazz:string, birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            if(!ValUser.isValid(userId, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department)) {
                return false;
            }

            return await Database.updateUser(userId, username, firstname, lastname, email, clazz, birthdate.toDateString(), biografie, permissions, department);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteUser(userId: string): Promise<boolean> {
        try {
            if(!ValUser.isUserIdValid(userId)) {
                return false;
            }

            return await Database.deleteUser(userId);
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
            if(!await ValUser.isUserValid(userId) || abilityId < 1) {
                return false;
            }

            if(await Database.userAbilityAlreadyExists(userId, abilityId)) {
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
            if(!await ValUser.isUserValid(userId)) {
                return null;
            }

            return await Database.getUserAbilitiesByUserId(userId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteUserAbility(userId: string, abilityId: number): Promise<boolean> {
        try {
            return await Database.deleteUserAbility(userId, abilityId);
        }
        catch (e) {
            return false;
        }
    }

    /* endregion */

    /* region Notification */

    static async addNotification(userId: string, title: string, text: string): Promise<boolean> {
        try {
            if(!ValNotification.isValid(userId, title, text)) {
                return false;
            }

            if(!await ValUser.isUserValid(userId)) {
                return false;
            }

            const date = new Date(Date.now());

            const dateTime = `${date.toLocaleDateString()};${date.toLocaleTimeString()}`;

            return await Database.addNotification(userId, title, text, dateTime);
        }
        catch (e) {
            return false;
        }
    }

    static async getNotifications(userId: string): Promise<Notification[] | null> {
        try {
            if(!ValUser.isUserIdValid(userId)) {
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
            if(!ValUser.isUserIdValid(userId) || notificationId < 1) {
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

            if(!await ValUser.isUserValid(ownerId)) {
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

            if(!await ValUser.isUserValid(ownerId)) {
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
            if(!ValUser.isUserIdValid(ownerId) || projectName.length < 1 || projectName.length > 30) {
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
            if(!ValUser.isUserIdValid(userId) || projectName.length < 1 || projectName.length > 30) {
                return false;
            }

            const projectId = await this.getProjectId(projectName, userId);

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
            if(!ValUser.isUserIdValid(userId) || projectId < 1) {
                return false;
            }

            return await Database.isUserOwnerOfProject(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getProjectsWhereUserIsOwner(userId: string): Promise<Project[] | null> {
        try {
            if(!await ValUser.isUserValid(userId)) {
                return null;
            }

            return await Database.getProjectsByOwnerId(userId);
        }
        catch (e) {
            return null;
        }
    }

    static async getProjectId(projectName: string, ownerId: string): Promise<number | null> {
        try {
            if(!ValUser.isUserIdValid(ownerId) || projectName.length < 1 || projectName.length > 30) {
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
            if(!await ValUser.isUserValid(userId) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            return await Database.addProjectMember(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async projectMemberAccepted(projectId: number, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isUserIdValid(userId) || projectId < 1) {
                return false;
            }

            const project = await this.getProject(projectId);

            if(project === null) {
                return false;
            }

            if(!await this.isUserOwnerOfProject(userId, projectId)) {
                return false;
            }

            const members = await Database.getAmountOfProjectMembersByProjectId(projectId);

            if(members >= project.maxMembers) {
                return false;
            }

            return Database.acceptProjectMember(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getProjectMembers(projectId: number): Promise<ProjectMember[] | null> {
        try {
            if(projectId < 1) {
                return null;
            }

            return await Database.getProjectMembersByProjectId(projectId);
        }
        catch (e) {
            return null;
        }
    }

    static async getPendingRequests(projectId: number): Promise<ProjectMember[] | null> {
        try {
            if(projectId < 1) {
                return null;
            }

            return await Database.getNotAcceptedProjectMembersByProjectId(projectId);
        }
        catch (e) {
            return null;
        }
    }

    static async getProjectsWhereUserIsMember(userId: string): Promise<Project[] | null> {
        try {
            if(!ValUser.isUserIdValid(userId)) {
                return null;
            }

            return await Database.getProjectsWhereUserIsMember(userId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteProjectMember(projectId: number, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isUserIdValid(userId)) {
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
            if(!await ValUser.isUserValid(userId) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            //Problems with getLikesByUserId
            const likes = await Database.getLikesByUserId(userId);

            for(const like of likes) {
                if(like.projectId === projectId) {
                    return false;
                }
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

    static async getLikedProjectsByUserId(userId: string): Promise<Project[]> {
        try {
            if(!ValUser.isUserIdValid(userId)) {
                return null;
            }

            return await Database.getLikedProjectsByUserId(userId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteLike(projectId: number, userId: string): Promise<boolean> {
        try {
            if(!ValUser.isUserIdValid(userId)) {
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
            if(!await ValUser.isUserValid(userId) || projectId < 1 || await Database.getProject(projectId) === null) {
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

    static async getProjectViews(projectId: number): Promise<number> {
        try {
            return await Database.getViewCount(projectId);
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

            if(await Database.projectAbilityAlreadyExists(projectId, abilityId)) {
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

    static async getAllAbilities(): Promise<Ability[]> {
        try {
            return await Database.getAbilities();
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
            if(!await ValUser.isUserValid(userId) || !await ValUser.isUserValid(otherUserId)) {
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
            if(!ValUser.isUserIdValid(userId)) {
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
            if(!ValUser.isUserIdValid(userId) || !ValUser.isUserIdValid(otherUserId)) {
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
            if(!ValUser.isUserIdValid(userId) || !ValUser.isUserIdValid(otherUserId)) {
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
            if(!ValMessage.isValid(userId, message) || chatId < 1){
                return false;
            }

            const chat = await Database.getDirectChatById(chatId);

            if(chat === null || (chat.userId !== userId && chat.otherUserId !== userId)) {
                return false;
            }

            const date = new Date(Date.now());

            const dateTime = `${date.toLocaleDateString()};${date.toLocaleTimeString()}`;

            return await Database.addMessage(chatId, userId, message, dateTime);
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
            if(!ValMessage.isValid(userId, message) || messageId < 1 || chatId < 1){
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
            if(!ValUser.isUserIdValid(userId) || messageId < 1) {
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