import {User, Project, View, Like, Message, DirectChat, Notification, ProjectMember, UserAbility, Ability, ProjectAbility} from "../../models";

export class HttpClient {

    baseUrl = "http://localhost:3000/api";
    bearer = `Bearer ${localStorage.token}`;

    /* region User */

    async addUser() {
        return await fetch(`${this.baseUrl}/user`, {
            method: 'POST',
            headers: {
                'Authorization': this.bearer
            },
            body: JSON.stringify({
                username: "test",
                birthdate: "2002-05-08",
            })
        })
            .then(response => response.json());
    }

    /* endregion */

    /* region Project */

    /* endregion */

    /* region Chat */

    /* endregion */
}