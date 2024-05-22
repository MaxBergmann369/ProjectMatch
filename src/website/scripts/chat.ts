import {initKeycloak, keycloak} from "./keycloak";
import {DirectChat, Message, User} from "../../models";
import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";

const authenticatedPromise = initKeycloak();

let client: HttpClient;
let user: User | null = null;
let chats: DirectChat[] = [];
let chatId: number = -1;

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await authenticatedPromise;
    if (authenticated) {
        client = new HttpClient();

        const tokenUser = new TokenUser(keycloak.tokenParsed);

        user = await client.getUser(tokenUser.userId);

        if(user === null) {
            location.href = "register.html";
        }

        await renderChatProfiles();
        await addButtonListener();
    }
    else {
        location.href = "index.html";
    }
});

async function addButtonListener() {
    const chatProfiles = document.getElementsByClassName("chat");

    const addBtn = document.getElementById("addChat");

    addBtn.addEventListener("click", async () => {
        let userFullName = (document.getElementById("input-bar") as HTMLInputElement).value;
        userFullName = userFullName.replace(" ", "-");
        if(userFullName !== "" ) {
            const userId = await client.getUserId(userFullName);

            await client.addDirectChat(user.userId, userId);
            await renderChatProfiles();
        }
    });

    const sendBtn = document.getElementById("sendMessage");

    sendBtn.addEventListener("click", async () => {
        const message = (document.getElementById("messageInput") as HTMLInputElement);

        if(chatId !== -1 && message.value !== "") {
            await sendMessage(chatId, message.value);
            message.value = "";
        }
    });

    for (let i = 0; i < chatProfiles.length; i++) {
        chatProfiles[i].addEventListener("click", async (event) => {
            const id = parseInt((event.target as HTMLElement).id);

            if(chatId !== id) {
                chatMessages.clear();
            }

            chatId = id;
            if(!isNaN(id)) {
                await renderChatMessages(id);
                scrollToBottom();
            }
        });
    }
}

async function renderChatProfiles() {
    chats = await client.getDirectChats(user.userId);

    const list = document.getElementById("chat-list");
    let chatElement: string = "";

    for(let i = 0; i < chats.length; i++) {
        if(chats[i].userId === user.userId) {
            const otherUser = await client.getUser(chats[i].otherUserId);
            chatElement = `<div class="chat" id="${chats[i].id}">${otherUser.firstname} ${otherUser.lastname}`;
        }
        else {
            const otherUser = await client.getUser(chats[i].userId);
            chatElement = `<div class="chat" id="${chats[i].id}">${otherUser.firstname} ${otherUser.lastname}`;
        }
        list.innerHTML += chatElement;
    }
}

const chatMessages = new Map<string, string[]>();

async function loadChatMessages(id: number) {
    const messages: Message[] = await client.getMessages(id);

    for(let i = 0; i < messages.length; i++) {
        const message = messages[i];

        const data = message.dateTime.split(";");

        let username = user.username;

        if (message.userId !== user.userId) {
            const user = await client.getUser(message.userId);
            username = user.username;
        }

        const time = data[1].split(':').slice(0, 2).join(':');

        const displayMessage = `${message.userId};${time} ${username} : ${message.message}`;

        const recentMessages = chatMessages.get(data[0]) || [];

        if(!recentMessages.includes(displayMessage)) {
            recentMessages.push(displayMessage);
        }

        chatMessages.set(data[0], recentMessages);
    }
}

async function renderChatMessages(id : number) {

    await loadChatMessages(id);

    const chat = document.getElementById("messageWindow");

    let html = "";

    for (let messageKey of chatMessages.keys()) {

        html += `<div class="date">${messageKey}</div>`;

        const messages = chatMessages.get(messageKey) || [];

        for(let i = 0; i < messages.length; i++) {

            const data = messages[i].split(';');

            const userId: string = data[0];
            const message: string = data[1];

            if (userId === user.userId) {
                html += `<div class="own-message">${message}</div>`;
            } else {
                html += `<div class="other-message">${message}</div>`;
            }
        }
    }

    chat.innerHTML = html;
}

async function sendMessage(chatId: number, message: string) {
    await client.addMessage(chatId, user.userId, message);
    await renderChatMessages(chatId);
    scrollToBottom();
}

function scrollToBottom() {
    const chatWindow = document.getElementById("chat-window");
    chatWindow.scrollTop = chatWindow.scrollHeight;
}