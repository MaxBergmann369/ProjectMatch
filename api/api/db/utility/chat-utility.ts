import {Database} from "../db";
import {ValMessage, ValUser} from "../validation";
import {DirectChat, Message} from "../../../models";

export class ChatUtility {
    /* region Chat */

    static async addDirectChat(userId: string, otherUserId: string): Promise<number | null> {
        try {
            const id = userId.toLowerCase();
            const otherId = otherUserId.toLowerCase();

            if(!(await ValUser.isUserValid(id)) || !(await ValUser.isUserValid(otherId)) || id === otherId) {
                return null;
            }

            const chat = await Database.getDirectChatByUserIds(id, otherId);

            if(chat !== null) {
                return null;
            }

            const data = new Date(Date.now());

            const date = data.toLocaleDateString();
            const time = data.toLocaleTimeString();

            return await Database.addDirectChat(id, otherId, date, time);
        }
        catch (e) {
            return null;
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

    static async getDirectChatById(chatId: number): Promise<DirectChat | null> {
        try {
            if(chatId < 1) {
                return null;
            }

            return await Database.getDirectChatById(chatId);
        }
        catch (e) {
            return null;
        }
    }

    static async updateDirectChat(chatId: number, userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || chatId < 1) {
                return false;
            }

            const chat = await Database.getDirectChatById(chatId);

            if(chat === null || !(chat.userId === id || chat.otherUserId === id)) {
                return false;
            }

            const data = new Date(Date.now());

            const date = data.toLocaleDateString();
            const time = data.toLocaleTimeString();

            return await Database.updateDirectChatLastOpened(chatId, userId, date, time);
        }
        catch (e) {
            return false;
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

            const data = new Date(Date.now());

            const date = data.toLocaleDateString();
            const time = data.toLocaleTimeString();

            return await Database.addMessage(chatId, id, message, date, time);
        }
        catch (e) {
            return false;
        }
    }

    static async getMessages(chatId: number, userId: string, min: number, max:number): Promise<Message[] | null> {
        try {
            const chat = await this.getDirectChatById(chatId);

            const diff = max - min;

            if(chat === null || !(chat.userId === userId || chat.otherUserId === userId) || min < 0 || max < 0 || min > max || diff > 100) {
                return null;
            }

            const amount = await Database.getAmountOfMessages(chatId);

            if(amount < max) {
                max = amount;
                min = amount - diff < 0 ? 0 : amount - diff;
            }

            const messages = await Database.getMessagesByChatId(chatId, min, max);

            if(messages === null) {
                return null;
            }

            await Database.markMessagesAsRead(chatId, userId);

            return messages;
        }
        catch (e) {
            return null;
        }
    }

    static async getAmountOfMessages(chatId: number): Promise<number> {
        try {
            if(chatId < 1) {
                return -1;
            }

            return await Database.getAmountOfMessages(chatId);
        }
        catch (e) {
            return -1;
        }
    }

    static async getUnreadMessages(chatId: number, userId: string): Promise<number> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id) || chatId < 1) {
                return -1;
            }

            return await Database.getUnreadMessages(chatId, id);
        }
        catch (e) {
            return -1;
        }
    }

    static async hasUnreadMessages(userId: string): Promise<boolean> {
        try {
            const id = userId.toLowerCase();

            if(!ValUser.isUserIdValid(id)) {
                return false;
            }

            return await Database.hasUnreadMessages(id);
        }
        catch (e) {
            return false;
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