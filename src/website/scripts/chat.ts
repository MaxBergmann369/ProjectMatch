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
        manageMessages();
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
    const messages: Message[] = await client.getMessages(id, 0, 100);

    messages.reverse();

    for(let i = 0; i < messages.length; i++) {
        const message = messages[i];

        let username = user.username;

        if (message.userId !== user.userId) {
            const user = await client.getUser(message.userId);
            username = user.username;
        }

        const time = message.time.slice(0, 5);
        const date = message.date;

        const displayMessage = `${message.userId};${time};${username};${message.message}`;

        const recentMessages = chatMessages.get(date) || [];

        if(!recentMessages.includes(displayMessage)) {
            recentMessages.push(displayMessage);
        }

        chatMessages.set(date, recentMessages);
    }
}

async function manageMessages() {
    // eslint-disable-next-line no-constant-condition
    while(true) {
        if(chatId !== -1) {
            shortMessagesMap();
            await renderChatMessages(chatId);
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

function shortMessagesMap(max: number = 10) {
    //remove from the map if the key with the newest messages has more than 10 messages than remove all other keys
    //and fromm the key with the oldest messages remove all messages except the last 10
    //if the key with the newest messages has less than 10 messages than remove from the other key all messages so that the total amount of messages is 10

}

async function renderChatMessages(id : number) {

    const chatWindow = document.getElementById("chat-window");

    const check = Math.ceil(chatWindow.scrollTop + chatWindow.clientHeight) === chatWindow.scrollHeight;

    await loadChatMessages(id);

    const chat = document.getElementById("messageWindow");

    let html = "";

    for (const messageKey of chatMessages.keys()) {

        html += `<div class="date">${messageKey}</div>`;

        const messages = chatMessages.get(messageKey) || [];

        for(let i = 0; i < messages.length; i++) {

            const data = messages[i].split(';');

            const userId: string = data[0];
            const time: string = data[1];
            const username: string = data[2];
            const message: string = data[3];

            if (userId === user.userId) {
                html += `<div class="own-message"><span class="time">${time}</span><span class="username">${username}</span><span class="message">${message}</span></div>`;
            } else {
                html += `<div class="other-message"><span class="message">${message}</span><span class="username">${username}</span><span class="time">${time}</span></div>`;
            }
        }
    }

    chat.innerHTML = html;

    scrollToBottom(check);
}

async function sendMessage(chatId: number, message: string) {
    await client.addMessage(chatId, user.userId, message);
    await renderChatMessages(chatId);
    scrollToBottom();
}

function scrollToBottom(below: boolean = true) {
    const chatWindow = document.getElementById("chat-window");

    if(below) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}