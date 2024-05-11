import {User, Project, View, Like, Message, DirectChat, Notification, ProjectMember, UserAbility, Ability, ProjectAbility} from "../../models";
import {keycloak} from "./keycloak";

export class HttpClient {

    baseUrl = "http://localhost:3000/api";
    //get keycloak token
    bearer = `Bearer ${keycloak.token}`

    /* region User */

    async addUser() {
        return await fetch(`${this.baseUrl}/user`, {
            method: 'POST',
            headers: {
                Authorization: this.bearer
            },
            body: JSON.stringify({
                username: "test",
                birthdate: "28.04.2001"
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