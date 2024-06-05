import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";
import {Notification} from "../../models";

let client: HttpClient = null;
let user: TokenUser = null;
let clicked = false;

const notificationTexts: Map<number, string> = new Map<number, string>();
const separator: string = ';';

export async function initNotifications(tokenUser: TokenUser) {
    user = tokenUser;
    client = new HttpClient();

    const notifications = document.getElementById('notifications');
    const notificationBox = document.getElementById('notification-box');

    await renderNotificationIcons();

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

    const orderedNotifications = notifications.sort((a, b) => {
        const dateA = a.dateTime.split(separator)[0];
        const dateB = b.dateTime.split(separator)[0];

        const timeA = a.dateTime.split(separator)[1];
        const timeB = b.dateTime.split(separator)[1];

        if (dateA === dateB) {
            return timeB.localeCompare(timeA);
        }

        return dateB.localeCompare(dateA);
    });

    for (const notification of orderedNotifications) {

        let html = `<div class="notification" id="${notification.id}">`;

        if (!notification.seen) {
            html += '<div class="notification-new"></div>';
        }

        html += `<h2>${notification.title}</h2>`;

        html += `<p>${notification.text.split(separator)[0]}</p>`;
        html += `<p>${notification.dateTime}</p>`;
        html += '</div>';

        notificationTexts.set(notification.id, notification.text);

        notificationElement.innerHTML += html;
    }
}

function notificationTypes(text: string): string {
    const data = text.split(separator);

    switch (data[1]) {
        case 'chat':
            return `chat.html?chat=${data[2]}`;
        case 'project':
            return `project.html?project=${data[2]}`;
        default:
            return '';
    }
}

async function renderNotificationIcons() {
    const chat = document.getElementById('chat');

    if (chat === null) {
        return;
    }

    const unread = await client.hasUnreadMessages(user.userId);

    console.log(unread);

    if (unread) {
        chat.innerHTML += '<img src="../resources/icons/badge-11.ico" class="notification-icon" alt="new Notifaction">';
    }
}

async function addButtonListeners() {
    const notifications = document.getElementsByClassName('notification');

    for (const notification of notifications) {
        await notification.addEventListener("click", async () => {
            const notId = parseInt(notification.id);

            const url = notificationTypes(notificationTexts.get(notId));

            if (isNaN(notId)) {
                return;
            }

            if(url === '') {
                location.href = url;
            }

            await client.markNotificationAsSeen(user.userId, notId);
            notification.getElementsByClassName('notification-new')[0].remove();
        });
    }
}