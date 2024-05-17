
import {Database} from "./db";
import {checkInvalidChars, ValMessage, ValNotification, ValProject, ValUser} from "./validation";
import {Ability, DirectChat, Like, Message, Notification, Project, ProjectMember, User, View} from "../../models";

export class Utility {

    /* region User */

    /* region Base */
    static async addUser(userId: string, username: string, firstname: string, lastname: string, email:string, clazz:string,
                   birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if (!ValUser.isValid(id, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department)) {
                return false;
            }

            return await Database.addUser(id, username, firstname, lastname, email, clazz, birthdate.toDateString(), biografie, permissions, department);
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
    
    static async getUserIdByFullName(fullName: string): Promise<string | null> {
        try {
            const names = fullName.split("-");

            if(fullName.length < 1 || fullName.length > 40 || names.length !== 2 || names[0].length < 1 || names[1].length < 1 || !checkInvalidChars(names[0]) || !checkInvalidChars(names[1])) {
                return null;
            }

            //first letter uppercase and the rest lowercase
            const firstname = names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();

            //first letter uppercase and the rest lowercase
            const lastname = names[1].charAt(0).toUpperCase() + names[1].slice(1).toLowerCase();

            return await Database.getUserIdByFullName(firstname, lastname);
        }
        catch (e) {
            throw new Error(e);
            return null;
        }
    }

    static async updateUser(userId: string, username: string, firstname: string, lastname: string, email:string, clazz:string, birthdate: Date, biografie: string, permissions: number, department: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isValid(id, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department)) {
                return false;
            }

            return await Database.updateUser(id, username, firstname, lastname, email, clazz, birthdate.toDateString(), biografie, permissions, department);
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
    static async addUserAbility(userId: string, abilityId: number): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!await ValUser.isUserValid(id) || abilityId < 1) {
                return false;
            }

            if(await Database.userAbilityAlreadyExists(id, abilityId)) {
                return false;
            }

            return await Database.addUserAbility(id, abilityId);
        }
        catch (e) {
            return false;
        }
    }

    static async getUserAbilities(userId: string): Promise<Ability[] | null> {
        try {
            const id = userId.toLowerCase();

            if(!await ValUser.isUserValid(id)) {
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

            if(!await ValUser.isUserValid(id)) {
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

    /* region Project */

    /* region Base */
    static async addProject(name: string, ownerId: string, thumbnail: string, description: string, links: string, maxMembers: number): Promise<boolean> {
        try {
            const owId = ownerId.toLowerCase();

            const date = new Date(Date.now());

            if(!ValProject.isValid(name, owId, thumbnail, description, date, links, maxMembers) || await this.getAmountOfProjects(ownerId) >= 5){
                return false;
            }

            if(!await ValUser.isUserValid(owId)) {
                return false;
            }

            if(await this.alreadyProjectWithSameName(owId, name, 0)) {
                return false;
            }

            return await Database.addProject(name, owId, thumbnail, description, date.toDateString(), links, maxMembers);
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
            const owId = ownerId.toLowerCase();

            return await Database.getAmountOfProjectsByOwnerId(owId);
        }
        catch (e) {
            return -1;
        }
    }

    static async updateProject(id: number, name: string, ownerId: string, thumbnail: string, description: string, links: string, maxMembers: number): Promise<boolean> {
        try {
            const owId = ownerId.toLowerCase();

            if(!ValProject.isValid(name, owId, thumbnail, description, new Date(Date.now()), links, maxMembers) || id < 1) {
                return false;
            }

            if(!await ValUser.isUserValid(owId)) {
                return false;
            }

            if(await this.alreadyProjectWithSameName(owId, name, id)) {
                return false;
            }

            return await Database.updateProject(id, name, owId, thumbnail, description, links, maxMembers);
        }
        catch (e) {
            return false;
        }
    }

    static async alreadyProjectWithSameName(ownerId: string, projectName: string, id: number): Promise<boolean> {
        try {
            const owId = ownerId.toLowerCase();

            if(!ValUser.isUserIdValid(owId) || projectName.length < 1 || projectName.length > 30) {
                return false;
            }

            const projects = await Database.getProjectsByOwnerId(owId);

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
            const owId = userId.toLowerCase();

            if(!await this.isUserOwnerOfProject(owId, projectId)) {
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
            const owId = userId.toLowerCase();

            if(!ValUser.isUserIdValid(owId) || projectName.length < 1 || projectName.length > 30) {
                return false;
            }

            const projectId = await this.getProjectId(projectName, owId);

            if (projectId === null) {
                return false;
            }

            return await this.deleteProject(owId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async isUserOwnerOfProject(userId: string, projectId: number): Promise<boolean> {
        try {
            const owId = userId.toLowerCase();

            if(!ValUser.isUserIdValid(owId) || projectId < 1) {
                return false;
            }

            return await Database.isUserOwnerOfProject(owId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getProjectsWhereUserIsOwner(userId: string): Promise<Project[] | null> {
        try {
            const owId = userId.toLowerCase();

            if(!await ValUser.isUserValid(owId)) {
                return null;
            }

            return await Database.getProjectsByOwnerId(owId);
        }
        catch (e) {
            return null;
        }
    }

    static async getProjectId(projectName: string, ownerId: string): Promise<number | null> {
        try {
            const owId = ownerId.toLowerCase();

            if(!ValUser.isUserIdValid(owId) || projectName.length < 1 || projectName.length > 30) {
                return null;
            }

            return await Database.getProjectIdBy(owId, projectName);
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
            const id = userId.toLowerCase();

            if(!await ValUser.isUserValid(id) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            return await Database.addProjectMember(id, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async projectMemberAccepted(projectId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || projectId < 1) {
                return false;
            }

            const project = await this.getProject(projectId);

            if(project === null) {
                return false;
            }

            if(!await this.isUserOwnerOfProject(id, projectId)) {
                return false;
            }

            const members = await Database.getAmountOfProjectMembersByProjectId(projectId);

            if(members >= project.maxMembers) {
                return false;
            }

            return Database.acceptProjectMember(id, projectId);
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
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return null;
            }

            return await Database.getProjectsWhereUserIsMember(id);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteProjectMember(projectId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return false;
            }

            return await Database.deleteProjectMember(id, projectId);
        }
        catch (e) {
            return false;
        }
    }
    /* endregion */

    /* region Like */
    static async addLike(projectId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!await ValUser.isUserValid(id) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            //Problems with getLikesByUserId
            const likes = await Database.getLikesByUserId(id);

            for(const like of likes) {
                if(like.projectId === projectId) {
                    return false;
                }
            }

            return await Database.addLike(id, projectId);
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
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return null;
            }

            return await Database.getLikedProjectsByUserId(id);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteLike(projectId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return false;
            }

            return await Database.deleteLike(id, projectId);
        }
        catch (e) {
            return false;
        }
    }

    /* endregion */

    /* region View */
    static async addView(projectId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!await ValUser.isUserValid(id) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            if(await Database.alreadyViewedProject(id, projectId)) {
                return false;
            }

            return await Database.addView(id, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getViews(projectId: number): Promise<number> {
        try {
            return await Database.getViewCount(projectId);
        }
        catch (e) {
            return null;
        }
    }

    static async getProjectViews(projectId: number): Promise<View[]> {
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
            const id = userId.toLowerCase();
            const otherId = otherUserId.toLowerCase();

            if(!await ValUser.isUserValid(id) || !await ValUser.isUserValid(otherId) || id === otherId) {
                return false;
            }

            const chat = await Database.getDirectChatByUserIds(id, otherId);

            if(chat !== null) {
                return false;
            }

            return await Database.addDirectChat(id, otherId);
        }
        catch (e) {
            return false;
        }
    }

    static async getDirectChats(userId: string): Promise<DirectChat[]> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return null;
            }

            return await Database.getDirectChatsByUserId(id);
        }
        catch (e) {
            return null;
        }
    }

    static async getDirectChat(userId: string, otherUserId: string): Promise<DirectChat | null> {
        try {
            const id = userId.toLowerCase();
            const otherId = otherUserId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || !ValUser.isUserIdValid(otherId) || id === otherId) {
                return null;
            }

            return await Database.getDirectChatByUserIds(id, otherId);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteDirectChat(userId: string, otherUserId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();
            const otherId = otherUserId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || !ValUser.isUserIdValid(otherId) || id === otherId) {
                return false;
            }

            const chat = await Database.getDirectChatByUserIds(id, otherId);

            if(chat === null || chat.userId !== id || chat.otherUserId !== otherId) {
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
            const id = userId.toLowerCase();

            if(!ValMessage.isValid(id, message) || chatId < 1){
                return false;
            }

            const chat = await Database.getDirectChatById(chatId);

            if(chat === null || !(chat.userId === id || chat.otherUserId === id)) {
                return false;
            }

            const date = new Date(Date.now());

            const dateTime = `${date.toLocaleDateString()};${date.toLocaleTimeString()}`;

            return await Database.addMessage(chatId, id, message, dateTime);
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
            const id = userId.toLowerCase();

            if(!ValMessage.isValid(id, message) || messageId < 1 || chatId < 1){
                return false;
            }

            return await Database.updateMessage(messageId, chatId, id, message);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteMessage(userId: string, messageId: number): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || messageId < 1) {
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