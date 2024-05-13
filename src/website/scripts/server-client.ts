import {User, Project, View, Like, Message, DirectChat, Notification, ProjectMember, UserAbility, Ability, ProjectAbility} from "../../models";
import {keycloak} from "./keycloak";

export class HttpClient {

    baseUrl = "http://localhost:3000/api";
    bearer = `Bearer ${keycloak.token}`

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
            .then(response => response.text());
    }

    async getUser(userId: string): Promise<User | null> {
        return await fetch(`${this.baseUrl}/user/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => {
                if(!response.ok) {
                    return null;
                }

                response.json()
            });
    }

    async updateUser(username: string, birthdate: string) {
        return await fetch(`${this.baseUrl}/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                username: username,
                birthdate: birthdate
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

    async addUserAbility(userId: string, abilityId: number) {
        return await fetch(`${this.baseUrl}/user/${userId}/ability`, {
            method: 'POST',
            headers: {
                Authorization: this.bearer
            },
            body: JSON.stringify({
                abilityId: abilityId
            })
        })
            .then(response => response.text());
    }

    async getUserAbilities(userId: string) {
        return await fetch(`${this.baseUrl}/user/${userId}/ability`, {
            method: 'GET',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.json());
    }

    async deleteUserAbility(userId: string, abilityId: number) {
        return await fetch(`${this.baseUrl}/user/${userId}/ability/${abilityId}`, {
            method: 'DELETE',
            headers: {
                Authorization: this.bearer
            }
        })
            .then(response => response.text());
    }

    /* endregion */

    /* region Project */

    /* endregion */

    /* region Chat */

    /* endregion */
}