
import {Database} from "./db";
import {ValProject, ValUser} from "./validation";
import {Ability, Project, ProjectMember, User, View} from "./models";

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
            if(!ValUser.isIFValid(userId)) {
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

    /* region Project */

    /* region Base */
    static async addProject(name: string, ownerId: string, thumbnail: string, description: string, links: string, maxMembers: number): Promise<boolean> {
        try {
            const date = new Date(Date.now());

            if(!ValProject.isValid(name, ownerId, thumbnail, description, date, links, maxMembers)) {
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

    static async updateProject(id: number, name: string, ownerId: string, thumbnail: string, description: string, links: string, maxMembers: number): Promise<boolean> {
        try {
            if(!ValProject.isValid(name, ownerId, thumbnail, description, new Date(Date.now()), links, maxMembers) || id < 1) {
                return false;
            }

            return await Database.updateProject(id, name, ownerId, thumbnail, description, links, maxMembers);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteProject(id: number): Promise<boolean> {
        try {
            return await Database.deleteProject(id);
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
            if(!ValUser.isIFValid(userId)) {
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
            if(!ValUser.isIFValid(userId)) {
                return false;
            }

            return await Database.addLike(userId, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getLikes(projectId: number): Promise<ProjectMember[]> {
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
            if(!ValUser.isIFValid(userId)) {
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

    /* region Ability */
    static async addAbilityToProject(projectId: number, abilityId: number): Promise<boolean> {
        try {
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