import {initKeycloak, keycloak} from "./keycloak";
import {DirectChat, Message, User} from "../../models";
import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";

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
        manageMessages();
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

    addBtn.addEventListener("click", async () => {
        const input = document.getElementById("input-user") as HTMLInputElement;
        let userFullName = input.value;

        input.value = "";

        userFullName = userFullName.replace(" ", "-");
        if(userFullName !== "" ) {
            const userId = await client.getUserId(userFullName);
            console.log(userId);

            await client.addDirectChat(user.userId, userId);
            await renderChatProfiles();
            await loadChatProfileButtons();
        }
    });

    const sendBtn = document.getElementById("sendMessage");

    sendBtn.addEventListener("click", async () => {
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
    // eslint-disable-next-line no-constant-condition
    while(true) {
        if(chatId !== -1 && layer === 0) {
            await renderChatMessages(chatId);
            await client.updateDirectChat(chatId, user.userId);
        }

        if(!searching) {
            await renderChatProfiles();
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
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

    messages.reverse();

    let otherUsername: string | undefined = undefined;

    let lastDate = "";
    let date = "";

    const orderedMessages: Message[] = messages.sort((a, b) => {
        const dateA = a.date;
        const dateB = b.date;

        const timeA = a.time;
        const timeB = b.time;

        if (dateA === dateB) {
            return timeA.localeCompare(timeB);
        }

        return dateA.localeCompare(dateB);
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

        const time = message.time.slice(0, 5);
        date = message.date;

        if(lastDate === "") {
            lastDate = date;
            recentMessages = chatMessages.get(date) || [];
        }
        else if(lastDate !== date) {
            chatMessages.set(lastDate, recentMessages);
            lastDate = date;
            recentMessages = [];
        }

        const displayMessage = `${message.userId};${time};${username};${message.message}`;

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
            const message: string = data[3];

            if (userId === user.userId) {
                html += `<div class="own-message"><span class="time">${time}</span><span class="username">${username}</span><span class="message">${message}</span></div>`;
            } else {
                html += `<div class="other-message"><span class="message">${message}</span><span class="username">${username}</span><span class="time">${time}</span></div>`;
            }
        }
    }

    chat.innerHTML = html;

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
        let fullName = input.value.replace(" ", "-");
        const list = document.getElementById("user-list");
        let html = "";

        if(fullName === "") {
            list.style.display = "none";
            return;
        }

        if(!fullName.includes("-")) {
            fullName += "-";
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

