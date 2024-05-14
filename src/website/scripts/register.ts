import {HttpClient} from "./server-client";
import {initKeycloak, keycloak} from "./keycloak";
import {User} from "../../models";

const auth = initKeycloak();
document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await auth;

    if (!authenticated) {
        location.href = "index.html";
    }

    const client = new HttpClient();

    const user1: User | null = await client.getUser(keycloak.tokenParsed.preferred_username);

    if(user1 !== null) {
        location.href = "home.html";
    }

    document.getElementById("registerForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const username = data.get("username") as string;
        const birthdate = data.get("birthdate") as string;
        const response = await client.addUser(username, birthdate);
        if (response) {
            location.href = "home.html";
        } else {
            console.error("Failed to register user");
        }
    });
});