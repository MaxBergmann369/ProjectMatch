import {Ability, DirectChat, Message, Notification, Project, User} from "./models";
import {keycloak} from "./keycloak";
import {Image} from 'image-js';

export class HttpClient {
    static baseUrl = "http://localhost:3000";
    // static baseUrl = "https://pm.hoellerl.dev";
    static pfpUrl = `${HttpClient.baseUrl}/pfp`;
    apiUrl = `${HttpClient.baseUrl}/api`;
    bearer = `Bearer ${keycloak.token}`;

    /* region User */

    async logout() {
        return await fetch(`${this.apiUrl}/logout`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async resizeImage(image: Blob, maxWidth: number, maxHeight: number): Promise<Blob> {
        const arrayBuffer = await image.arrayBuffer();
        let img = await Image.load(arrayBuffer);
        let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        img = img.resize({ width: img.width * ratio, height: img.height * ratio });
        return img.toBlob(image.type,0.95);
    }

    async uploadImage(image: Blob): Promise<string> {
        const resizedImage = await this.resizeImage(image, 720, 720);
        const formData = new FormData();
        formData.append('image', resizedImage);

        return await fetch(`${this.apiUrl}/user/image`, {
            method: 'POST',
            headers: {
                Authorization: this.bearer
            },
            body: formData
        })
            .then(response => response.ok ? response.text() : null);
    }

    async addUser(username: string, birthdate: string) {
        return await fetch(`${this.apiUrl}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                username: username,
                birthdate: birthdate
            })
        })
            .then(response => response.ok);
    }

    async getUser(userId: string): Promise<User | null> {
        return await fetch(`${this.apiUrl}/user/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);

    }

    async getFullNameByUserId(userId: string): Promise<string | null> {
        return await fetch(`${this.apiUrl}/user/fullName/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.text() : null);
    }

    async getTop10UserMatching(fullName: string) {
        return await fetch(`${this.apiUrl}/user/top10/${fullName}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);
    }

    async getUserId(fullName: string): Promise<string | null> {
        return await fetch(`${this.apiUrl}/userId/${fullName}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.text() : null);
    }

    async updateUser(userId: string, username:string, bio: string) {
        return await fetch(`${this.apiUrl}/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                userId: userId,
                username: username,
                bio: bio
            })
        })
            .then(response => response.text());
    }

    async deleteUser(userId: string) {
        return await fetch(`${this.apiUrl}/user/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addUserAbilities(userId: string, abilityIds: number[]) {
        return await fetch(`${this.apiUrl}/user/${userId}/abilities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                abilityId: abilityIds
            })
        })
            .then(response => response.ok);
    }

    async updateUserAbilities(userId: string, abilityIds: number[]) {
        return await fetch(`${this.apiUrl}/user/${userId}/abilities`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                abilityId: abilityIds
            })
        })
            .then(response => response.ok);
    }

    async getUserAbilities(userId: string) : Promise<Ability[] | null> {
        return await fetch(`${this.apiUrl}/user/${userId}/abilities`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json(): null);
    }

    async getNotifications(userId: string): Promise<Notification[]> {
        return await fetch(`${this.apiUrl}/user/${userId}/notification/`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok ? response.json() : null);
    }

    async markNotificationAsSeen(userId: string, notId: number) {
        return await fetch(`${this.apiUrl}/user/notification`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                userId: userId,
                notId: notId
            })
        })
            .then(response => response.ok);
    }

    async deleteUserAbility(userId: string, abilityId: number) {
        return await fetch(`${this.apiUrl}/user/${userId}/abilities/${abilityId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async getAbilities() : Promise<Ability[] | null> {
        return await fetch(`${this.apiUrl}/user/abilities`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    /* endregion */

    /* region Project */

    async addProject(project: Project) {
        return await fetch(`${this.apiUrl}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify(project)
        })
            .then(response => response.ok? response.text(): "-1");
    }

    async getProject(projectId: number): Promise<Project | null> {
        return await fetch(`${this.apiUrl}/projects/id/${projectId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);

    }

    async getProjects(showOldProjects?:boolean): Promise<Project[] | null> {
        if (showOldProjects === undefined) {
            showOldProjects = false;
        }
        return await fetch(`${this.apiUrl}/projects/${showOldProjects}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);

    }

    async getTop10Projects() {
        return await fetch(`${this.apiUrl}/projects/top10`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);
    }

    async deleteData() {
        return await fetch(`${this.apiUrl}/deleteData`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok ? response.text() : null);
    }

    async updateProject(project: Project) {
        return await fetch(`${this.apiUrl}/projects`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify(project)
        })
            .then(response => response.text());
    }

    async deleteProject(projectId: number) {
        return await fetch(`${this.apiUrl}/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addProjectMember(projectId: number) {
        return await fetch(`${this.apiUrl}/projects/members/${projectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            }
        })
            .then(response => response.ok);
    }

    async getProjectMembers(projectId: number, isAccepted: boolean=true) : Promise<User[] | null> {
        return await fetch(`${this.apiUrl}/projects/members/${projectId}/${isAccepted}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async getProjectsWhereUserIsMember(userId: string, isAccepted:boolean=true):Promise<Project[] | null> {
        return await fetch(`${this.apiUrl}/users/members/${userId}/${isAccepted}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async getProjectsLikedByUser(userId: string):Promise<Project[] | null> {
        return await fetch(`${this.apiUrl}/projects/liked/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async acceptProjectMember(projectId: number, userId: string) {
            return await fetch(`${this.apiUrl}/projects/${projectId}/members/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async deleteProjectMember(projectId: number, userId: string) {
        return await fetch(`${this.apiUrl}/projects/${projectId}/members/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addView(projectId: number) {
        return await fetch(`${this.apiUrl}/views`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                projectId: projectId
            })
        })
            .then(response => response.ok);
    }

    async getViews(projectId: number) {
        return await fetch(`${this.apiUrl}/views/${projectId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addLike(projectId: number) {
        return await fetch(`${this.apiUrl}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                projectId: projectId
            })
        })
            .then(response => response.ok);
    }

    async getLikes(projectId: number) {
        return await fetch(`${this.apiUrl}/likes/${projectId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async isLiked(projectId: number, userId: string): Promise<boolean> {
        return await fetch(`${this.apiUrl}/isLiked/${projectId}/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok);
    }

    async deleteLike(projectId: number) {
        return await fetch(`${this.apiUrl}/likes/${projectId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addProjectAbilities(projectId: number, abilityIds: number[]) {
        return await fetch(`${this.apiUrl}/projects/${projectId}/abilities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                abilityIds: abilityIds
            })
        })
            .then(response => response.text());
    }

    async getProjectAbilities(projectId: number):Promise<Ability[]> {
        return await fetch(`${this.apiUrl}/projects/${projectId}/abilities`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async deleteProjectAbility(projectId: number, abilityId: number) {
        return await fetch(`${this.apiUrl}/projects/${projectId}/abilities/${abilityId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    /* endregion */

    /* region Chat */

    async addDirectChat(userId: string, otherUserId: string) {
        return await fetch(`${this.apiUrl}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                userId: userId,
                otherUserId: otherUserId
            })
        })
            .then(response => response.text());
    }

    async getDirectChat(userId: string, otherUserId: string) : Promise<DirectChat> {
        return await fetch(`${this.apiUrl}/chats/${userId}/${otherUserId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async getDirectChats(userId: string):Promise<DirectChat[]> {
        return await fetch(`${this.apiUrl}/chats/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async updateDirectChat(chatId: number, userId: string) {
        return await fetch(`${this.apiUrl}/chats/${chatId}/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async deleteDirectChat(userId: string, otherUserId: string) {
        return await fetch(`${this.apiUrl}/chats/${userId}/${otherUserId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addMessage(chatId: number, userId: string, message: string) {
        return await fetch(`${this.apiUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                chatId: chatId,
                userId: userId,
                message: message
            })
        })
            .then(response => response.text());
    }

    async getMessages(chatId: number, min: number, max: number) :Promise<[number, Message[]]>  {
        return await fetch(`${this.apiUrl}/messages/${chatId}/${min}/${max}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok ? response.json() : null);
    }

    async getUnreadMessages(chatId: number, userId: string): Promise<number> {
        return await fetch(`${this.apiUrl}/messages/unread/${chatId}/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : 0);
    }

    async hasUnreadMessages(userId: string): Promise<boolean> {
        return await fetch(`${this.apiUrl}/messages/unread/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok);
    }

    async editMessage(messageId: number, chatId: number, userId: string, message: string) {
        return await fetch(`${this.apiUrl}/messages/${chatId}/${messageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                userId: userId,
                message: message
            })
        })
            .then(response => response.text());
    }

    async deleteMessage(messageId: number) {
        return await fetch(`${this.apiUrl}/messages/${messageId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    /* endregion */
}