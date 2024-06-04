import {UserUtility} from "./utility/user-utility";

const separator: string = ';';

export class SystemNotification {
    static async newChatNotification(userId:string, otherUserId: string, chatId: number) {
        try {
            const user = await UserUtility.getUser(userId);
            await UserUtility.addNotification(otherUserId, `${user.firstname} ${user.lastname} wants to chat with you!`, `You have a new chat, click to enter the chat.${separator}chat${separator}${chatId}`);
        } catch (e) { /* empty */ }
    }
}