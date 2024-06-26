import {Database} from "../db";
import {ValProject, ValUser} from "../validation";
import {Ability, Project, User, View} from "../../../models";
import {SystemNotification} from "../system-notifications";
import {SocketController} from "../../socket/socket-controller";

export class ProjectUtility {
    /* region Base */
    static async addProject(name: string, ownerId: string, thumbnail: string, description: string, links: string, maxMembers: number): Promise<number> {
        try {
            const owId = ownerId.toLowerCase();

            const date = new Date(Date.now());

            if(!ValProject.isValid(name, owId, thumbnail, description, date, links, maxMembers) || await this.getAmountOfProjects(ownerId) >= 50){
                return -1;
            }

            if(!await ValUser.isUserValid(owId)) {
                return -1;
            }

            if(await this.alreadyProjectWithSameName(owId, name, 0)) {
                return -1;
            }

            name = name.replace(/</g, "&lt;");
            name = name.replace(/>/g, "&gt;");

            description = description.replace(/</g, "&lt;");
            description = description.replace(/>/g, "&gt;");

            const projectId:number = await Database.addProject(name, owId, thumbnail, description, date.toUTCString(), links, maxMembers);

            if (projectId === null) {
                return -1;
            }
            if (!await Database.addProjectMember(owId, projectId, true)){
                return -1;
            }
            return projectId;
        }
        catch (e) {
            return -1;
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

            name = name.replace(/</g, "&lt;");
            name = name.replace(/>/g, "&gt;");

            description = description.replace(/</g, "&lt;");
            description = description.replace(/>/g, "&gt;");

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

            projectName = projectName.replace(/</g, "&lt;");
            projectName = projectName.replace(/>/g, "&gt;");

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

            if(!(await this.isUserOwnerOfProject(owId, projectId))) {
                return false;
            }

            return await Database.deleteProject(projectId);
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

    static async getProjectId(projectName: string, ownerId: string): Promise<number | null> {
        try {
            const owId = ownerId.toLowerCase();

            if(!ValUser.isUserIdValid(owId) || projectName.length < 1 || projectName.length > 30) {
                return null;
            }

            projectName = projectName.replace(/</g, "&lt;");
            projectName = projectName.replace(/>/g, "&gt;");

            return await Database.getProjectIdBy(owId, projectName);
        }
        catch (e) {
            return null;
        }
    }

    static async getProjects(projectIds: number[]): Promise<Project[] | null> {
        try {
            return await Database.getProjects(projectIds);
        }
        catch (e) {
            // throw e;
            return null;
        }
    }
    /* endregion */

    /* region ProjectMember */
    static async addMemberRequest(projectId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!(await ValUser.isUserValid(id)) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            if(await Database.isProjectMember(id, projectId, false) ||
                await Database.isProjectMember(id, projectId, true) ||
            await Database.isUserOwnerOfProject(id, projectId)) {
                return false;
            }

            await SystemNotification.projectMemberRequest(userId, projectId);

            return await Database.addProjectMember(id, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async projectMemberAccepted(projectId: number, ownerId: string, userId: string): Promise<boolean> {
        try {
            const owId = ownerId.toLowerCase();
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || !ValUser.isUserIdValid(owId) || projectId < 1) {
                return false;
            }

            const project = await this.getProject(projectId);

            if(project === null) {
                return false;
            }

            if(!(await this.isUserOwnerOfProject(owId, projectId))) {
                return false;
            }

            const members = await Database.getAmountOfProjectMembersByProjectId(projectId);

            if(members >= project.maxMembers) {
                return false;
            }

            if(await Database.isProjectMember(id, projectId, true)) {
                return false;
            }

            await SystemNotification.projectAccepted(userId, projectId);

            return await Database.acceptProjectMember(id, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async getProjectMembers(projectId: number, isAccepted: boolean): Promise<User[] | null> {
        try {
            if(projectId < 1) {
                return null;
            }

            return await Database.getProjectMembersByProjectId(projectId, isAccepted);
        }
        catch (e) {
            return null;
        }
    }

    static async getProjectsWhereUserIsMember(userId: string, isAccepted:boolean): Promise<Project[] | null> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return null;
            }

            return await Database.getProjectsWhereUserIsMember(id, isAccepted);
        }
        catch (e) {
            return null;
        }
    }

    static async deleteProjectMember(projectId: number, ownerId:string, userId: string): Promise<boolean> {
        try {
            const owId = ownerId.toLowerCase();
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return false;
            }

            if((!(await this.isUserOwnerOfProject(owId, projectId))) && owId !== id) {
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

            if(!(await ValUser.isUserValid(id)) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            //Problems with getLikesByUserId
            const liked = await Database.isProjectLikedByUser(id, projectId);

            if(liked) {
                return false;
            }

            if(await Database.addLike(id, projectId)) {
                await SocketController.onLike(projectId);
                return true;
            }

            return false;
        }
        catch (e) {
            return false;
        }
    }

    static async getLikes(projectId: number): Promise<number> {
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

    static async isProjectLikedByUser(projectId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || projectId < 1) {
                return false;
            }

            return await Database.isProjectLikedByUser(id, projectId);
        }
        catch (e) {
            return false;
        }
    }

    static async deleteLike(projectId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return false;
            }

            if(await Database.deleteLike(id, projectId)) {
                await SocketController.onLike(projectId);
                return true;
            }

            return false;
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

            if(!(await ValUser.isUserValid(id)) || projectId < 1 || await Database.getProject(projectId) === null) {
                return false;
            }

            if(await Database.alreadyViewedProject(id, projectId)) {
                return false;
            }

            if(await Database.addView(id, projectId)) {
                await SocketController.onView(projectId);
                return true;
            }

            return false;
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
    static async addProjectAbilities(projectId: number, abilityIds: number[]): Promise<boolean> {
        try {
            if(abilityIds.length === 0 || projectId < 1 || await Database.getProject(projectId) === null){
                return false;
            }
            const projectAbilities: Ability[] = await this.getAbilitiesByProjectId(projectId);

            const newAbilities = abilityIds.filter(abilityId => !projectAbilities.some(ability => ability.id === abilityId));

            return await Database.addProjectAbilities(projectId, newAbilities);
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

    static async deleteAbilityFromProject(projectId: number, abilityId: number, userId:string): Promise<boolean> {
        try {
            if (!(await ProjectUtility.isUserOwnerOfProject(userId, projectId))){
                return false;
            }
            return await Database.deleteProjectAbility(projectId, abilityId);
        }
        catch (e) {
            return false;
        }
    }
    /* endregion */
}