import Keycloak from "keycloak-js";

export enum Role {
    Unknown = 0,
    Student = 1,
    Teacher = 2,
    TestUser = 3
}

export const keycloak = new Keycloak({
    url: "https://auth.htl-leonding.ac.at",
    realm: "htl-leonding",
    clientId: "htlleonding-service"
});

export async function initKeycloak() {
    try {
        return await keycloak.init({
            onLoad: "check-sso",
            flow: "implicit",
            pkceMethod: 'S256',
            // enableLogging: true,
            silentCheckSsoRedirectUri:
                window.location.origin + '/silent-check-sso.html',
        });
    }
    catch (error) {
        console.error("Keycloak initialization failed", error);
        return false;
    }
}


export function ldapToRole(ldap: string): Role {
    const prefix = "OU=";
    if (ldap.includes(`${prefix}Students`)) {
        return Role.Student;
    }
    if (ldap.includes(`${prefix}Teachers`)) {
        return Role.Teacher;
    }
    if (ldap.includes(`${prefix}TestUsers`)) {
        return Role.TestUser;
    }

    return Role.Unknown;
}

export function ldapToClass(ldap: string): string {
    const pattern = /OU=(\d[A-Z]+)/;
    const match = ldap.match(pattern);
    if (match) {
        return match[1];
    }
    return "N/A";
}