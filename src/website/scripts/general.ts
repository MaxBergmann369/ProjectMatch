import { keycloak} from "./keycloak";

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");
    logoutButton?.addEventListener("click",  () => {
        console.log("logout");
        if (keycloak.authenticated) {
            keycloak.logout();
        }
    });
});