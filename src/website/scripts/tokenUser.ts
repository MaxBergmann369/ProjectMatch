import {KeycloakTokenParsed} from "keycloak-js";
import {Department, Role} from "../../models";

export class TokenUser {
    userId: string;
    firstname: string;
    lastname: string;
    class: string;
    role: Role;
    email: string;
    department: Department;

    constructor(token: any) {
        this.userId = token.preferred_username;
        this.firstname = token.given_name;
        this.lastname = token.family_name;
        this.email = token.email;
        const ldap = token.LDAP_ENTRY_DN;

        const regex = /OU=(\d[A-Z]+),OU=([A-Z]{2}),OU=(Students|Teachers|TestUsers)/;
        const match = ldap.match(regex);

        if (match) {
            this.class = match[1];
            this.department = Department[match[2] as keyof typeof Department];
            console.log(match[2]);
            // match 3 without the s
            this.role = Role[match[3].slice(0, -1) as keyof typeof Role];
        }
        else {
            this.class = "N/A";
            this.department = Department.Unset;
            this.role = Role.Unknown;
        }
    }
}