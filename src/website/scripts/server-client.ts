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
                'Content-Type': 'application/json',
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
            .then(response => {
                if(!response.ok) {
                    return null;
                }

                response.json()
            });
    }

    async getProjects(): Promise<Project[] | null> {
        return await fetch(`${this.baseUrl}/projects`, {
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

    async getProjectsWhereUserIsOwner(userId: string): Promise<Project[] | null> {
        return await fetch(`${this.baseUrl}/projects/${userId}`, {
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

    async addProjectAbility(projectId: number, abilityId: number) {
        return await fetch(`${this.baseUrl}/projects/${projectId}/abilities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.bearer
            },
            body: JSON.stringify({
                abilityId: abilityId
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

    /* endregion */
}