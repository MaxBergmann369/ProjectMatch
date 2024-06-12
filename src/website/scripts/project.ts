import "./general";
import {initKeycloak} from "./keycloak";
const authenticatedPromise = initKeycloak();

document.addEventListener("DOMContentLoaded", async() => {
    const auth = await authenticatedPromise;
    if (!auth) {
        console.log("User is not authenticated");
        location.href = "index.html";
        return;
    }
});