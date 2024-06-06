import {UserUtility} from "./utility/user-utility";
import {ProjectUtility} from "./utility/project-utility";

const separator: string = ';';

export class SystemNotification {
    static async newChat(userId:string, otherUserId: string, chatId: number) {
        try {
            const user = await UserUtility.getUser(userId);
            await UserUtility.addNotification(otherUserId, `${user.firstname} ${user.lastname} wants to chat with you!`, `You have a new chat, click to enter the chat.${separator}chat${separator}${chatId}`);
        } catch (e) { /* empty */ }
    }

    static async projectMemberRequest(userId:string, projectId: number) {
        try {
            const user = await UserUtility.getUser(userId);
            const project = await ProjectUtility.getProject(projectId);
            await UserUtility.addNotification(project.ownerId, `${user.firstname} ${user.lastname} wants to be a member in your project!`, `${user.firstname} ${user.lastname} wants to be a member in your project ${project.name}.${separator}project${separator}${projectId}`);
        } catch (e) { /* empty */ }
    }

    static async projectAccepted(userId: string, projectId: number) {
        try {
            const project = await ProjectUtility.getProject(projectId);
            await UserUtility.addNotification(userId, `Congratulations you got accepted!`, `You got accepted by ${project.name}.${separator}project${separator}${projectId}`);
        } catch (e) { /* empty */ }
    }
}