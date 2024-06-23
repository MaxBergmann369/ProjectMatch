import {initKeycloak, keycloak} from "./keycloak";
import {DirectChat, Message, User} from "./models";
import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";
import "./general";
import {SocketClient} from "./socket-client";
import {renderChatNotificationIcon} from "./notifications";

const authenticatedPromise = initKeycloak();

const maxRenderAmount: number = 50;

let client: HttpClient;
let user: User | null = null;
let chats: [DirectChat[], string[]] = [[], []];
let chatId: number = -1;
let layer: number = 0;
let messageAmount: number = 0;
let searching: boolean = false;

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await authenticatedPromise;
    if (authenticated) {
        client = new HttpClient();
        window.addEventListener("beforeunload", async () => {
            await client.updateDirectChat(chatId, user.userId);
        });
        const tokenUser = new TokenUser(keycloak.tokenParsed);

        user = await client.getUser(tokenUser.userId);

        if(user === null) {
            location.href = "register.html";
        }

        await renderChatProfiles();
        await manageMessages();
        await addEventListener();

        // Get the chat parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const chat = urlParams.get("chat");

        // Check if the chat parameter exists and is a valid number
        if (chat && !isNaN(Number(chat))) {
            // Set chatId to the value of the chat parameter and render the chat messages
            chatId = Number(chat);
            await renderChatMessages(chatId);
        }
    }
    else {
        location.href = "index.html";
    }
});

async function addEventListener() {

    const addBtn = document.getElementById("addChat");

    addBtn.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("input-user") as HTMLInputElement;
        let userFullName = input.value;

        input.value = "";

        userFullName = userFullName.replace(" ", "+");
        if(userFullName !== "" ) {
            const userId = await client.getUserId(userFullName);
            console.log(userId);

            await client.addDirectChat(user.userId, userId);
            await renderChatProfiles();
            await loadChatProfileButtons();
        }
    });

    const sendBtn = document.getElementById("input-bar");

    sendBtn.addEventListener("submit", async (event) => {
        event.preventDefault();
        const message = (document.getElementById("messageInput") as HTMLInputElement);

        if(chatId !== -1 && message.value !== "") {
            await sendMessage(chatId, message.value);
            message.value = "";
        }
        else if(message.value === "") {
            alert("Please write a message");
        }
        else {
            alert("Please select a chat and write a message");
        }
    });

    await loadChatButtons();
    await loadChatProfileButtons();
    await loadUsernames();
    await searchForChat();
}

async function loadDeleteBtn() {
    const deleteBtns = document.getElementsByClassName("delete");

    for(const deleteBtn of deleteBtns) {
        deleteBtn.addEventListener("click", async (event) => {
            const element = event.target as HTMLElement;
            const id = parseInt(element.id);

            const confirmDelete = confirm("Are you sure you want to delete this message?");

            if(confirmDelete) {
                await client.deleteMessage(id);
                await renderChatMessages(chatId);
            }
        });
    }
}

async function loadChatProfileButtons() {
    const chatProfiles = document.getElementsByClassName("chat");

    for (const profile of chatProfiles) {
        profile.addEventListener("click", async () => {
            const id = parseInt(profile.id);

            if(chatId !== id) {
                chatMessages.clear();
            }

            await client.updateDirectChat(id, user.userId);

            if(chatId !== -1) {
                await client.updateDirectChat(chatId, user.userId);
            }

            if(!isNaN(id)) {
                chatId = id;

                const layerUp = document.getElementById("layer-up");

                if(messageAmount <= maxRenderAmount) {
                    layerUp.style.display = "block";
                }

                await renderChatMessages(id);
                await renderChatProfiles(true);
                await renderChatNotificationIcon();
            }
        });
    }
}

async function addUserButtons() {
    const userProfiles = document.getElementsByClassName("user");
    const input = document.getElementById("input-user") as HTMLInputElement;
    const userList = document.getElementById("user-list");

    for (let i = 0; i < userProfiles.length; i++) {
        userProfiles[i].addEventListener("click", async (event) => {
            const element = event.target as HTMLElement;

            if(element.id !== "") {
                input.value = element.innerText;
                userList.style.display = "none";
            }
        });
    }
}

async function renderChatProfiles(load: boolean = true) {
    if(load) {
        chats[0] = await client.getDirectChats(user.userId);
        chats[1] = [];
    }

    const list = document.getElementById("chat-list");
    let chatElement: string = "";

    for(let i = 0; i < chats[0].length; i++) {
        const userId = chats[0][i].userId === user.userId ? chats[0][i].otherUserId : chats[0][i].userId;

        let fullName: string;
        let unreadMessages: number = 0;

        if(load) {
            unreadMessages = await client.getUnreadMessages(chats[0][i].id, user.userId);
            fullName = await client.getFullNameByUserId(userId);
            chats[1].push(fullName);
        }
        else {
            fullName = chats[1][i];
        }

        chatElement += `<div class="chat" id="${chats[0][i].id}">${fullName} ${unreadMessages}</div>`;
    }

    list.innerHTML = chatElement;

    await loadChatProfileButtons();
}

async function loadChatButtons() {
    const layerUp = document.getElementById("layer-up");
    const layerDown = document.getElementById("layer-down");

    layerUp.addEventListener("click", async () => {
        layer++;
        await renderChatMessages(chatId, true);
    });

    layerDown.addEventListener("click", async () => {
        layer--;
        await renderChatMessages(chatId);
    });
}

async function manageMessages() {
    const socketClient = SocketClient.getInstance();

    socketClient.onMessage(async (socketChatId) => {
        if(chatId !== -1 && layer === 0 && socketChatId == chatId) {
            await renderChatMessages(chatId);
            await client.updateDirectChat(chatId, user.userId);
        }

        if(!searching) {
            await renderChatProfiles();
        }
    });
}

const chatMessages = new Map<string, string[]>();

async function loadChatMessages(id: number) {
    chatMessages.clear();

    const maxLayer = Math.ceil(messageAmount / maxRenderAmount);

    const renderAmount = isNaN(Math.ceil(messageAmount / maxLayer)) ? 0 : Math.ceil(messageAmount / maxLayer);

    const layerUp = document.getElementById("layer-up");

    if(layer >= maxLayer - 1) {
        layerUp.style.display = "none";
    }
    else {
        layerUp.style.display = "block";
    }

    if(layer >= maxLayer && layer !== 0) {
        layer--;
    }

    const min: number =  renderAmount * layer;
    const max: number  =  renderAmount * (layer + 1);

    const data = await client.getMessages(id, min < 0 ? 0 : min, max < 0 ? 0 : max);

    if(data === null) {
        return;
    }

    const messages: Message[] = data[1];
    messageAmount = data[0];

    let otherUsername: string | undefined = undefined;

    let lastDate = "";
    let date = "";

    const orderedMessages: Message[] = messages.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateA.getTime() - dateB.getTime();
    });

    let recentMessages: string[] = [];

    for(const message of orderedMessages) {

        let username = user.username;

        if (message.userId !== user.userId) {

            if (!otherUsername) {
                otherUsername = (await client.getUser(message.userId)).username;
            }

            username = otherUsername;
        }

        date = new Date(message.date).toLocaleDateString();
        const time = new Date(message.date).toLocaleTimeString().slice(0, 5);

        if(lastDate === "") {
            lastDate = date;
            recentMessages = chatMessages.get(date) || [];
        }
        else if(lastDate !== date) {
            chatMessages.set(lastDate, recentMessages);
            lastDate = date;
            recentMessages = [];
        }

        const displayMessage = `${message.userId};${time};${username};${message.message};${message.id}`;

        recentMessages.push(displayMessage);
    }

    chatMessages.set(date, recentMessages);
}

async function renderChatMessages(id : number, scrollDown: boolean = false) {
    const data = await client.getMessages(id, 0, 1);

    messageAmount = data[0];

    const chatWindow = document.getElementById("chat-window");

    const check = Math.ceil(chatWindow.scrollTop + chatWindow.clientHeight) === chatWindow.scrollHeight || scrollDown;

    await loadChatMessages(id);

    const chat = document.getElementById("messageWindow");

    let html = "";

    chat.innerHTML = "";

    for (const messageKey of chatMessages.keys()) {

        html += `<div class="date">${messageKey}</div>`;

        const messages = chatMessages.get(messageKey) || [];

        for(let i = 0; i < messages.length; i++) {

            const data = messages[i].split(';');

            const userId: string = data[0];
            const time: string = data[1];
            const username: string = data[2];
            let message: string = data[3];
            const id: string = data[4];
            message = message.replace(/</g, "&lt;");
            message = message.replace(/>/g, "&gt;");
            if (userId === user.userId) {
                html += `<div class="own-message message"><div class="msg-content"><div><b class="username">${username}:</b><span class="time">${time}</span></div><div><span>${message}</span><img id=${id} class="delete" src="./resources/trash.svg" alt="delete"></div></div></div>`;
            } else {
                html += `<div class="other-message message"><div class="msg-content"><div><b class="username">${username}:</b><span class="time">${time}</span></div><span>${message}</span></div></div>`;
            }
        }
    }

    chat.innerHTML = html;

    await loadDeleteBtn();

    const layerDown = document.getElementById("layer-down");

    if(layer > 0) {
        layerDown.style.display = "block";
    }
    else {
        layerDown.style.display = "none";
    }

    scrollToBottom(check);
}

async function sendMessage(chatId: number, message: string) {
    await client.addMessage(chatId, user.userId, message);
    layer = 0;

    await renderChatMessages(chatId);
    await renderChatNotificationIcon();
    scrollToBottom();
}

function scrollToBottom(below: boolean = true) {
    const chatWindow = document.getElementById("chat-window");

    if(below) {
        chatWindow.scrollTop = chatWindow.scrollHeight + chatWindow.clientHeight;
    }
}

async function loadUsernames() {
    const input = document.getElementById("input-user") as HTMLInputElement;

    input.addEventListener("input", async () => {
        let fullName = input.value.replace(" ", "+");
        const list = document.getElementById("user-list");
        let html = "";

        if(fullName === "") {
            list.style.display = "none";
            return;
        }

        if(!fullName.includes("+")) {
            fullName += "+";
        }

        const users = await client.getTop10UserMatching(fullName);

        if(users === null || users.length === 0) {
            list.style.display = "none";
            return;
        }

        list.style.display = "block";

        for(let i = 0; i < users.length; i++) {
            html += `<div class="user" id="${users[i][0]}">${users[i][1]}</div>`;
        }

        list.innerHTML = html;

        await addUserButtons();
    });
}

async function searchForChat() {
    const input = document.getElementById("input-chat") as HTMLInputElement;

    input.addEventListener("input", async () => {
        const search = input.value.toLowerCase();

        if(search === "") {
            searching = false;
            await renderChatProfiles();
            return;
        }

        searching = true;

        //sort the chats by the search input
        const sortedChats: [DirectChat[], string[]] = [[], []];

        for(let i = 0; i < chats[0].length; i++) {
            if(chats[1][i].toLowerCase().startsWith(search)) {
                sortedChats[0].push(chats[0][i]);
                sortedChats[1].push(chats[1][i]);
            }
        }

        chats = sortedChats;

        await renderChatProfiles(false);
    });
}

