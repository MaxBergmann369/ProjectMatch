import {Database} from "../db";
import {ValMessage, ValUser} from "../validation";
import {DirectChat, Message} from "../../../models";

export class ChatUtility {
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
}