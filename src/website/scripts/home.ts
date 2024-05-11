import {keycloak, initKeycloak} from "./keycloak";
import {Role} from "../../models";
import {TokenUser} from "./tokenUser";
import {HttpClient} from "./server-client";

const authenticatedPromise = initKeycloak();

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await authenticatedPromise;
    if (authenticated) {
        console.log("User is authenticated");
        const user = new TokenUser(keycloak.tokenParsed);
        const data = `
            Username: ${user.userId}
            Firstname: ${user.firstname}
            Lastname: ${user.lastname}
            Email: ${user.email}
            Role: ${Role[user.role]}
            Class: ${user.class}
            Department: ${user.department}
        `;
        document.getElementById("username").innerText = data;

        let client = new HttpClient();
        client.addUser().then((data) => {
            console.log(data);
        });

        // TODO: check if user doesnt exist in database yet:
        if (authenticated.toString() === keycloak.token) {
            // TODO: redirect to register page; unreachable: do above
        }
    }
    else {
        console.log("User is not authenticated");
        location.href = "index.html";
    }
});