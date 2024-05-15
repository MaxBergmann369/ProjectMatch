import {initKeycloak, keycloak} from "./keycloak";
import {User} from "../../models";
import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";

const authenticatedPromise = initKeycloak();

let client: HttpClient;
let user: User | null = null;

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await authenticatedPromise;
    if (authenticated) {
        client = new HttpClient();

        const tokenUser = new TokenUser(keycloak.tokenParsed);

        user = await client.getUser(tokenUser.userId);

        if(user === null) {
            location.href = "register.html";
        }

        //await renderChatProfiles();
        await addButtonListener();
    }
    else {
        console.log("User is not authenticated");
        location.href = "index.html";
    }
});

async function addButtonListener() {
    const chatProfiles = document.getElementsByClassName("chat");

    console.log("trst");
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

    for (let i = 0; i < chatProfiles.length; i++) {
        chatProfiles[i].addEventListener("click", async (event) => {
            const id = parseInt((event.target as HTMLElement).id);
            if(!isNaN(id)) {
                await renderChatMessages(id);
            }
        });
    }
}

async function renderChatProfiles() {
    console.log("trst");
    const chats = await client.getDirectChats(user.userId);

    const list = document.getElementById("chat-list");

    for(const chat of chats) {
        const chatProfile = document.createElement("li");
        chatProfile.innerText = chat.user1 === user.userId ? chat.user2 : chat.user1;
        chatProfile.id = chat.id.toString();
        chatProfile.classList.add("chat");
        list.appendChild(chatProfile);
    }
}

async function renderChatMessages(id: number) {

}