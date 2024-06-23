import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";
import {Notification} from "./models";
import {SocketClient} from "./socket-client";
import {keycloak} from "./keycloak";

let client: HttpClient = null;
let user: TokenUser = null;

let notificationsLoaded: Notification[] = [];

const notificationTexts: Map<number, string> = new Map<number, string>();
const separator: string = ';';

export async function initNotifications(tokenUser: TokenUser) {
    user = tokenUser;
    client = new HttpClient();

    await renderNotificationIcons();

    const socketClient = SocketClient.getInstance();

    socketClient.onNotification(() => {
        renderNotificationIcons().then(() => {
            addEventListener();
        });
    });

    socketClient.onMessage(async () => {
        await renderChatNotificationIcon();
    });

    addEventListener();
}

function addEventListener() {
    const notifications = document.getElementById('notifications');
    const notificationBox = document.getElementById('notification-box');

    window.addEventListener('click', async (event) => {
        if (event.target !== notifications && event.target !== notificationBox) {
            notificationBox.style.display = 'none';
        }
    });

    notifications.addEventListener('click', async () => {
        if (notificationBox.style.display === 'none' || notificationBox.style.display === '') {
            await loadNotifications();
            await renderNotifications(notificationBox);
            await addButtonListeners();
            notificationBox.style.display = 'block';
        } else {
            notificationBox.style.display = 'none';
        }
    });
}

async function loadNotifications(): Promise<void> {
    const notificationsDb: Notification[] | null = await client.getNotifications(user.userId);

    if (notificationsDb === null) {
        return null;
    }

    notificationsLoaded = notificationsDb;
}

async function renderNotifications(notificationElement: HTMLElement) {
    const notifications: Notification[] = notificationsLoaded;

    if (notifications === null || notifications.length === 0) {
        return;
    }

    notificationElement.innerHTML = '';

    const orderedNotifications: Notification[] = notifications.sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);

        return dateB.getTime() - dateA.getTime();
    });

    for (const notification of orderedNotifications) {

        let html = `<div class="notification" id="${notification.id}">`;

        if (!notification.seen) {
            html += '<div class="notification-new"></div>';
        }
        notification.title = notification.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        notification.text = notification.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html += `<h2>${notification.title}</h2>`;

        html += `<p>${notification.text.split(separator)[0]}</p>`;
        const date = new Date(notification.dateTime);
        html += `<p>${date.toLocaleString()}</p>`;
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
            return `project.html?id=${data[2]}&pending=${data[3] !== null ? data[3] : false}`;
        default:
            return '';
    }
}

export async function renderChatNotificationIcon() {
    const chat = document.getElementById('chatNavButton');

    const unread = await client.hasUnreadMessages(user.userId);
    console.log(unread)

    const icon = document.getElementById('chat-icon');

    if (unread && chat !== null && icon === null) {
        chat.innerHTML += '<img src="./resources/icons/badge-11.ico" id="chat-icon" class="chat-notification-icon" alt="new Notifaction">';
    }
    else {
        if (icon !== null) {
            icon.remove();
        }
    }
}

async function renderNotificationIcons() {
    await loadNotifications();

    const notificationBtn = document.getElementById('notification-btn');

    if(notificationsLoaded === undefined) {
        return;
    }

    const unreadNotifications = notificationsLoaded.map(notification => notification.seen).filter(seen => !seen).length;

    if(unreadNotifications !== null && notificationBtn !== null) {
        notificationBtn.classList.remove('notification-icon');
        switch (unreadNotifications) {
            case 0:
                break;
            case 1:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-1.ico" class="notification-icon" alt="new Notifaction">';
                break
            case 2:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-2.ico" class="notification-icon" alt="new Notifaction">';
                break
            case 3:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-3.ico" class="notification-icon" alt="new Notifaction">';
                break
            case 4:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-4.ico" class="notification-icon" alt="new Notifaction">';
                break
            case 5:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-5.ico" class="notification-icon" alt="new Notifaction">';
                break
            case 6:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-6.ico" class="notification-icon" alt="new Notifaction">';
                break
            case 7:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-7.ico" class="notification-icon" alt="new Notifaction">';
                break
            case 8:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-8.ico" class="notification-icon" alt="new Notifaction">';
                break
            case 9:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-9.ico" class="notification-icon" alt="new Notifaction">';
                break
            default:
                notificationBtn.innerHTML += '<img src="./resources/icons/badge-10.ico" class="notification-icon" alt="new Notifaction">';
        }
    }
}

async function addButtonListeners() {
    const notifications = document.getElementsByClassName('notification');

    for (const notification of notifications) {
        notification.addEventListener("click", async () => {
            const notId = parseInt(notification.id);

            await renderNotificationIcons();

            const url = notificationTypes(notificationTexts.get(notId));

            if (isNaN(notId)) {
                return;
            }

            if(url !== '') {
                location.href = url;
            }

            await client.markNotificationAsSeen(user.userId, notId);
            notification.getElementsByClassName('notification-new')[0].remove();
        });
    }
}