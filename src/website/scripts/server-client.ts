import {User, Project, View, Like, Message, DirectChat, Notification, ProjectMember, UserAbility, Ability, ProjectAbility} from "../../models";
import {keycloak} from "./keycloak";

export class HttpClient {

    baseUrl = "http://localhost:3000/api";
    bearer = `Bearer ${keycloak.token}`;

    /* region User */

    async addUser(username: string, birthdate: string) {
        return await fetch(`${this.baseUrl}/user`, {
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
        return await fetch(`${this.baseUrl}/user/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);

    }

    async getUserId(fullName: string): Promise<string | null> {
        return await fetch(`${this.baseUrl}/userId/${fullName}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.text() : null);
    }

    async updateUser(userId: string, username:string, birthdate: string, pfp: string) {
        return await fetch(`${this.baseUrl}/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                userId: userId,
                username: username,
                birthdate: birthdate,
                pfp: pfp
            })
        })
            .then(response => response.text());
    }

    async deleteUser(userId: string) {
        return await fetch(`${this.baseUrl}/user/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addUserAbilities(userId: string, abilityIds: number[]) {
        return await fetch(`${this.baseUrl}/user/${userId}/abilities`, {
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

    async getUserAbilities(userId: string) {
        return await fetch(`${this.baseUrl}/user/${userId}/abilities`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async deleteUserAbility(userId: string, abilityId: number) {
        return await fetch(`${this.baseUrl}/user/${userId}/abilities/${abilityId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async getAbilities() {
        return await fetch(`${this.baseUrl}/user/abilities`, {
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
        return await fetch(`${this.baseUrl}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify(project)
        })
            .then(response => response.text());
    }

    async getProject(projectId: number): Promise<Project | null> {
        return await fetch(`${this.baseUrl}/projects/${projectId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);

    }

    async getProjects(): Promise<Project[] | null> {
        return await fetch(`${this.baseUrl}/projects`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);

    }

    async getProjectsWhereUserIsOwner(userId: string): Promise<Project[] | null> {
        return await fetch(`${this.baseUrl}/projects/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.ok? response.json() : null);
    }

    async updateProject(project: Project) {
        return await fetch(`${this.baseUrl}/projects`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify(project)
        })
            .then(response => response.text());
    }

    async deleteProject(projectId: number, userId: string) {
        return await fetch(`${this.baseUrl}/projects/${userId}/${projectId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addProjectMember(projectId: number, userId: string) {
        return await fetch(`${this.baseUrl}/projects/${projectId}/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                userId: userId
            })
        })
            .then(response => response.text());
    }

    async getProjectMembers(projectId: number) {
        return await fetch(`${this.baseUrl}/projects/${projectId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async getProjectsWhereUserIsMember(userId: string) {
        return await fetch(`${this.baseUrl}/projects/members/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async acceptProjectMember(projectId: number, userId: string) {
            return await fetch(`${this.baseUrl}/projects/${projectId}/members/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async deleteProjectMember(projectId: number, userId: string) {
        return await fetch(`${this.baseUrl}/project/${projectId}/member/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addView(projectId: number, userId: string) {
        return await fetch(`${this.baseUrl}/views`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                projectId: projectId,
                userId: userId
            })
        })
            .then(response => response.text());
    }

    async getViews(projectId: number) {
        return await fetch(`${this.baseUrl}/views/${projectId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addLike(projectId: number, userId: string) {
        return await fetch(`${this.baseUrl}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                projectId: projectId,
                userId: userId
            })
        })
            .then(response => response.text());
    }

    async getLikes(projectId: number) {
        return await fetch(`${this.baseUrl}/likes/${projectId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async deleteLike(projectId: number, userId: string) {
        return await fetch(`${this.baseUrl}/likes/${projectId}/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addProjectAbilities(projectId: number, abilityIds: number[]) {
        return await fetch(`${this.baseUrl}/projects/${projectId}/abilities`, {
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

    async getProjectAbilities(projectId: number) {
        return await fetch(`${this.baseUrl}/projects/${projectId}/abilities`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async deleteProjectAbility(projectId: number, abilityId: number) {
        return await fetch(`${this.baseUrl}/projects/${projectId}/abilities/${abilityId}`, {
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
        return await fetch(`${this.baseUrl}/chats`, {
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

    async getDirectChat(userId: string, otherUserId: string) {
        return await fetch(`${this.baseUrl}/chats/${userId}/${otherUserId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async getDirectChats(userId: string) {
        return await fetch(`${this.baseUrl}/chats/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async deleteDirectChat(userId: string, otherUserId: string) {
        return await fetch(`${this.baseUrl}/chats/${userId}/${otherUserId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    async addMessage(chatId: number, userId: string, message: string) {
        return await fetch(`${this.baseUrl}/messages`, {
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

    async getMessages(chatId: number, min: number, max: number) {
        return await fetch(`${this.baseUrl}/messages/${chatId}/${min}/${max}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async editMessage(messageId: number, chatId: number, userId: string, message: string) {
        return await fetch(`${this.baseUrl}/messages/${chatId}/${messageId}`, {
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

    async deleteMessage(messageId: number, userId: string) {
        return await fetch(`${this.baseUrl}/messages/${userId}/${messageId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    /* endregion */
}