import express from "express";

const chatRouter = express.Router();

export function createChatEndpoints() {
    return chatRouter;
}

module.exports = { createChatEndpoints };