import express from "express";
import {ChatUtility} from "../db/utility/chat-utility";
import {EndPoints} from "../db/validation";
import {SystemNotification} from "../db/system-notifications";

const chatRouter = express.Router();

export function createChatEndpoints() {

    /* region Chat */

    chatRouter.post('/chats', async (req, res) => {
        try {
            const {userId, otherUserId} = req.body;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const chatId: number | null = await ChatUtility.addDirectChat(userId, otherUserId);

            if(chatId !== null) {
                await SystemNotification.newChat(userId, otherUserId, chatId);
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.get('/chats/:userId/:otherUserId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const otherUserId = req.params.otherUserId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const chat = await ChatUtility.getDirectChat(userId, otherUserId);

            if (chat !== null) {
                res.status(200).send(chat);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.get('/chats/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const chats = await ChatUtility.getDirectChats(userId);

            if (chats !== null) {
                res.status(200).send(chats);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.put('/chats/:chatId/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const chatId = parseInt(req.params.chatId);

            if(isNaN(chatId)) {
                res.sendStatus(400);
                return;
            }

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            if (await ChatUtility.updateDirectChat(chatId, userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.delete('/chats/:userId/:otherUserId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const otherUserId = req.params.otherUserId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            if (await ChatUtility.deleteDirectChat(userId, otherUserId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    /* region Message */

    chatRouter.post('/messages', async (req, res) => {
        try {
            const {chatId, userId, message} = req.body;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            if (await ChatUtility.addMessage(chatId, userId, message)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.get('/messages/unread/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const unread = await ChatUtility.hasUnreadMessages(userId);

            if (unread) {
                res.status(200).send(unread.toString());
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.get('/messages/unread/:chatId/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const chatId = parseInt(req.params.chatId);

            if(isNaN(chatId)) {
                res.sendStatus(400);
                return;
            }

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()){
                res.sendStatus(400);
                return;
            }

            const amount = await ChatUtility.getUnreadMessages(chatId, userId);

            if (amount !== -1) {
                res.status(200).send(amount.toString());
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.get('/messages/:chatId/:min/:max', async (req, res) => {
        try {
            const chatId = parseInt(req.params.chatId);
            let min = parseInt(req.params.min);
            let max = parseInt(req.params.max);

            min = min < 0 ? 0 : min;
            max = max < 0 ? 0 : max;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(chatId)) {
                res.sendStatus(400);
                return;
            }

            const amount = await ChatUtility.getAmountOfMessages(chatId);
            const messages = await ChatUtility.getMessages(chatId, tokenUser.userId, min, max);

            if (messages !== null && amount !== -1) {
                res.status(200).send([amount, messages]);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.put('/messages/:chatId/:messageId', async (req, res) => {
        try {
            const messageId = parseInt(req.params.messageId);
            const chatId = parseInt(req.params.chatId);

            const {userId, message} = req.body;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(messageId) || isNaN(chatId)) {
                res.sendStatus(400);
                return;
            }

            if (await ChatUtility.updateMessage(messageId, chatId, userId, message)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.delete('/messages/:userId/:messageId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const messageId = parseInt(req.params.messageId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(messageId)) {
                res.sendStatus(400);
                return;
            }

            if(await ChatUtility.deleteMessage(userId, messageId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    return chatRouter;
}

module.exports = { createChatEndpoints };