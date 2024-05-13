import express from "express";
import {Utility} from "../db/utility";
import {EndPoints} from "../db/validation";

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

            if(await Utility.addDirectChat(userId, otherUserId)) {
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

            const chat = await Utility.getDirectChat(userId, otherUserId);

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

            const chats = await Utility.getDirectChats(userId);

            if (chats !== null) {
                res.status(200).send(chats);
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

            if (await Utility.deleteDirectChat(userId, otherUserId)) {
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

            if (await Utility.addMessage(chatId, userId, message)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.get('/messages/:chatId', async (req, res) => {
        try {
            const chatId = parseInt(req.params.chatId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(chatId)) {
                res.sendStatus(400);
                return;
            }

            const messages = await Utility.getMessages(chatId);

            if (messages !== null) {
                res.status(200).send(messages);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    chatRouter.put('/messages', async (req, res) => {
        try {
            const {messageId, chatId, userId, message} = req.body;

            const id = parseInt(messageId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if (await Utility.updateMessage(id, chatId, userId, message)) {
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

            if(await Utility.deleteMessage(userId, messageId)) {
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