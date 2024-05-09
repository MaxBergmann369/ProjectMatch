import express from "express";
import {Utility} from "../db/utility";

const chatRouter = express.Router();

export function createChatEndpoints() {

    /* region Chat */

    chatRouter.post('/chat', async (req, res) => {
        const {userId, otherUserId} = req.body;

        if(await Utility.addDirectChat(userId, otherUserId)) {
            res.status(200).send("Chat added");
        } else {
            res.status(400).send("Chat not added");
        }
    });

    chatRouter.get('/chat', async (req, res) => {
        const {userId, otherUserId} = req.body;

        const chat = await Utility.getDirectChat(userId, otherUserId);

        if(chat !== null) {
            res.status(200).send(chat);
        } else {
            res.status(400).send("Chat not found");
        }
    });

    chatRouter.get('/chats', async (req, res) => {
        const userId = req.query.userId as string;

        const chats = await Utility.getDirectChats(userId);

        if(chats !== null) {
            res.status(200).send(chats);
        } else {
            res.status(400).send("Chats not found");
        }
    });

    chatRouter.delete('/chat', async (req, res) => {
        const {userId, otherUserId} = req.body;

        if(await Utility.deleteDirectChat(userId, otherUserId)) {
            res.status(200).send("Chat deleted");
        } else {
            res.status(400).send("Chat not deleted");
        }
    });

    /* endregion */

    /* region Message */

    chatRouter.post('/message', async (req, res) => {
        const {chatId, userId, message} = req.body;

        if(await Utility.addMessage(chatId, userId, message)) {
            res.status(200).send("Message added");
        } else {
            res.status(400).send("Message not added");
        }
    });

    chatRouter.get('/messages', async (req, res) => {
        const chatId = req.query.chatId as string;

        const id = parseInt(chatId);

        if(isNaN(id)) {
            res.status(400).send("Invalid chat id");
            return;
        }

        const messages = await Utility.getMessages(id);

        if(messages !== null) {
            res.status(200).send(messages);
        } else {
            res.status(400).send("Messages not found");
        }
    });

    chatRouter.put('/message', async (req, res) => {
        const {messageId, chatId, userId, message} = req.body;

        const id = parseInt(messageId);

        if(isNaN(id)) {
            res.status(400).send("Invalid message id");
            return;
        }

        if(await Utility.updateMessage(messageId, chatId, userId, message)) {
            res.status(200).send("Message updated");
        } else {
            res.status(400).send("Message not updated");
        }
    });

    chatRouter.delete('/message', async (req, res) => {
        const userId = req.query.userId as string;
        const messageId = req.query.messageId as string;

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
    });

    /* endregion */

    return chatRouter;
}

module.exports = { createChatEndpoints };