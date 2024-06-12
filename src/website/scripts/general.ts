import { keycloak} from "./keycloak";
import {initNotifications} from "./notifications";
import {TokenUser} from "./tokenUser";

function insertGlobalHtmlElements() {
    document.head.insertAdjacentHTML('beforeend', `<link rel="icon" href="./resources/favicon.ico" />`);
    document.body.insertAdjacentHTML('afterbegin', `<nav>
    <div class="center">
        <a href="home.html" title="Home" class="navButton"><img src="resources/nav/home.svg" alt="Home"></a>
        <a href="profile.html" title="Profiles" class="navButton"><img src="resources/nav/user.svg" alt="Profiles"></a>
        <a href="chat.html" title="Chats" id="chatNavButton" class="navButton"><img src="resources/nav/message-circle.svg" alt="Chats"></a>
        <div id="notification-btn" title="Notifications" class="nav-notification navButton">
            <img id="notifications" src="resources/nav/bell.svg" alt="Home">
            <div id="notification-box"></div>
        </div>
        <a href="javascript:void(0)" title="Logout" id="logout" class="navButton"><img src="resources/nav/log-out.svg" alt="Logout"></a>
        
    </div>
</nav>`);
}

document.addEventListener("DOMContentLoaded", async () => {
    insertGlobalHtmlElements();
    const logoutButton = document.getElementById("logout");
    logoutButton?.addEventListener("click",  () => {
        console.log("logout");
        if (keycloak.authenticated) {
            keycloak.logout();
        }
    });
    while (!keycloak.authenticated) {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    await initNotifications(new TokenUser(keycloak.tokenParsed));
});