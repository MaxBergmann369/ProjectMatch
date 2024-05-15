import {initKeycloak, keycloak} from "./keycloak";

initKeycloak().then((authenticated) => {
    if (authenticated){
        location.href = "home1.html";
    }
});
document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("login");
    loginButton.addEventListener("click", () => {
        keycloak.login().then(() => {
            location.href = "home.html";
        });
    });
});

