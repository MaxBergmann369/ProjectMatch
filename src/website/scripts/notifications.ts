import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";
import {Notification} from "../../models";

let client: HttpClient = null;
let user: TokenUser = null;
let clicked = false;

export async function initNotifications(tokenUser: TokenUser) {
    user = tokenUser;
    client = new HttpClient();

    const notifications = document.getElementById('notifications');
    const notificationBox = document.getElementById('notification-box');

    notifications.addEventListener('click', async () => {
        if(clicked) {
            notificationBox.style.display = 'none';
            clicked = false;
        }
        else {
            notificationBox.style.display = 'block';
            await renderNotifications(notificationBox);
            await addButtonListeners();
            clicked = true;
        }
    });
}

async function renderNotifications(notificationElement: HTMLElement) {

    const notifications: Notification[] = await client.getNotifications(user.userId);

    if (notifications === null || notifications.length === 0) {
        return;
    }

    notificationElement.innerHTML = '';

    for (const notification of notifications) {

        let html = `<div class="notification" id="${notification.id}">`;

        if (!notification.seen) {
            html += '<div class="notification-new"></div>';
        }

        html += `<h2>${notification.title}</h2>`;
        html += `<p>${notification.text}</p>`;
        html += `<p>${notification.dateTime}</p>`;
        html += '</div>';

        notificationElement.innerHTML += html;
    }
}

async function addButtonListeners() {
    const notifications = document.getElementsByClassName('notification');

    for (const notification of notifications) {
        console.log(notification);
        await notification.addEventListener("click", async () => {
            const notId = parseInt(notification.id);

            console.log(notId);
            if (isNaN(notId)) {
                return;
            }

            await client.markNotificationAsSeen(user.userId, notId);
            notification.classList.remove('notification-new');
        });
    }
}