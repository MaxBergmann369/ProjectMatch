import {initKeycloak, keycloak} from "./keycloak";
import {Role, User} from "../../models";
import {TokenUser} from "./tokenUser";
import {HttpClient} from "./server-client";

const authenticatedPromise = initKeycloak();

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await authenticatedPromise;
    if (authenticated) {
        const client = new HttpClient();
        console.log("User is authenticated");
        const user = new TokenUser(keycloak.tokenParsed);


        const user1: User | null = await client.getUser(user.userId);

        if(user1 === null) {
            location.href = "register.html";
        }
        document.getElementById("username").innerText = `
            UserId: ${user.userId}
            Username: ${user1.username}
            Born on: ${user1.birthdate}
            Firstname: ${user.firstname}
            Lastname: ${user.lastname}
            Email: ${user.email}
            Role: ${Role[user.role]}
            Class: ${user.class}
            Department: ${user.department}
        `;
    }
    else {
        console.log("User is not authenticated");
        location.href = "index.html";
    }
});