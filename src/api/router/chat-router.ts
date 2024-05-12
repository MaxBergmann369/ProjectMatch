import express from "express";
import {Utility} from "../db/utility";

const chatRouter = express.Router();

export function createChatEndpoints() {

    /* region Chat */

    chatRouter.post('/chats', async (req, res) => {
        try {
            const {userId, otherUserId} = req.body;

            if(await Utility.addDirectChat(userId, otherUserId)) {
                res.status(200).send("Chat added");
            } else {
                res.status(400).send("Chat not added");
            }
        } catch (e) {
            res.status(400).send("Chat not added");
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
                res.status(400).send("Chat not found");
            }
        } catch (e) {
            res.status(400).send("Chat not found");
        }
    });

    chatRouter.get('/chats/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const chats = await Utility.getDirectChats(userId);

            if (chats !== null) {
                res.status(200).send(chats);
            } else {
                res.status(400).send("Chats not found");
            }
        } catch (e) {
            res.status(400).send("Chats not found");
        }
    });

    chatRouter.delete('/chats/:userId/:otherUserId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const otherUserId = req.params.otherUserId;
            if (await Utility.deleteDirectChat(userId, otherUserId)) {
                res.status(200).send("Chat deleted");
            } else {
                res.status(400).send("Chat not deleted");
            }
        } catch (e) {
            res.status(400).send("Chat not deleted");
        }
    });

    /* endregion */

    /* region Message */

    chatRouter.post('/messages', async (req, res) => {
        try {
            const {chatId, userId, message} = req.body;

            if (await Utility.addMessage(chatId, userId, message)) {
                res.status(200).send("Message added");
            } else {
                res.status(400).send("Message not added");
            }
        } catch (e) {
            res.status(400).send("Message not added");
        }
    });

    chatRouter.get('/messages/:chatId', async (req, res) => {
        try {
            const chatId = req.params.chatId;

            const id = parseInt(chatId);

            if (isNaN(id)) {
                res.status(400).send("Invalid chat id");
                return;
            }

            const messages = await Utility.getMessages(id);

            if (messages !== null) {
                res.status(200).send(messages);
            } else {
                res.status(400).send("Messages not found");
            }
        } catch (e) {
            res.status(400).send("Messages not found");
        }
    });

    chatRouter.put('/messages', async (req, res) => {
        try {
            const {messageId, chatId, userId, message} = req.body;

            const id = parseInt(messageId);

            if (isNaN(id)) {
                res.status(400).send("Invalid message id");
                return;
            }

            if (await Utility.updateMessage(messageId, chatId, userId, message)) {
                res.status(200).send("Message updated");
            } else {
                res.status(400).send("Message not updated");
            }
        } catch (e) {
            res.status(400).send("Message not updated");
        }
    });

    chatRouter.delete('/messages/:userId/:messageId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const messageId = req.params.messageId;

            const id = parseInt(messageId);

            if(isNaN(id)) {
                res.status(400).send("Invalid message id");
                return;
            }

            if(await Utility.deleteMessage(userId, id)) {
                res.status(200).send("Message deleted");
            } else {
                res.status(400).send("Message not deleted");
            }
        } catch (e) {
            res.status(400).send("Message not deleted");
        }
    });

    /* endregion */

    return chatRouter;
}

module.exports = { createChatEndpoints };