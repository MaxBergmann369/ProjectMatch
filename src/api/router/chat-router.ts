import express from "express";
import {Utility} from "../db/utility";

const chatRouter = express.Router();

export function createChatEndpoints() {

    /* region Chat */

    chatRouter.post('/chats', async (req, res) => {
        try {
            const {userId, otherUserId} = req.body;

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
            const chatId = req.params.chatId;

            const id = parseInt(chatId);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const messages = await Utility.getMessages(id);

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

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if (await Utility.updateMessage(messageId, chatId, userId, message)) {
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
            const messageId = req.params.messageId;

            const id = parseInt(messageId);

            if(isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if(await Utility.deleteMessage(userId, id)) {
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