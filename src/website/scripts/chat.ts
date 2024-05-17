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
        console.log(chats);
        await addButtonListener();
    }
    else {
        console.log("User is not authenticated");
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
            console.log(userId);
            await client.addDirectChat(user.userId, userId);
            await renderChatProfiles();
        }
    });

    const sendBtn = document.getElementById("sendMessage");

    sendBtn.addEventListener("click", async () => {
        const message = (document.getElementById("messageInput") as HTMLInputElement);

        if(chatId !== -1) {
            await sendMessage(chatId, message.value);
            message.value = "";
        }
    });

    for (let i = 0; i < chatProfiles.length; i++) {
        chatProfiles[i].addEventListener("click", async (event) => {
            const id = parseInt((event.target as HTMLElement).id);
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

    for(let i = 0; i < chats.length; i++) {
        const otherUser = await client.getUser(chats[i].otherUserId);
        const chatElement = `<div class="chat" id="${i+1}">${otherUser.firstname} ${otherUser.lastname}`;
        list.innerHTML += chatElement;
    }
}

async function renderChatMessages(id: number) {
    const messages : Message[] = await client.getMessages(id);

    const chat = document.getElementById("messageWindow");

    let html = "";

    for(let i = 0; i < messages.length; i++) {
        const message: Message = messages[i];

        if(message.userId === user.userId) {
            html += `<div class="own-message">${message.dateTime} ${user.username} : ${message.message}</div>`;
        }
        else {
            const username = await client.getUser(message.userId);
            html += `<div class="own-message">${message.dateTime} ${username.username} : ${message.message}</div>`;
        }
    }

    chat.innerHTML = html;
}

async function sendMessage(chatId: number, message: string) {
    await client.addMessage(chatId, user.userId, message);
    await renderChatMessages(chatId);
}