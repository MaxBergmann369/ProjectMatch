import {keycloak, initKeycloak, ldapToRole, ldapToClass, Role} from "./keycloak";

const authenticatedPromise = initKeycloak();

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await authenticatedPromise;
    if (authenticated) {
        console.log("User is authenticated");
        const ldap = keycloak.tokenParsed.LDAP_ENTRY_DN;
        document.getElementById("username").innerText = `
        Username: ${keycloak.tokenParsed.preferred_username}
        First name: ${keycloak.tokenParsed.given_name}
        Last name: ${keycloak.tokenParsed.family_name}
        Email: ${keycloak.tokenParsed.email}
        Role: ${Role[ldapToRole(ldap)]}
        Class: ${ldapToClass(ldap)}
        LDAP: ${ldap}
        `;
        // TODO: check if user doesnt exist in database yet:
        if (authenticated.toString() === keycloak.token) {
            // TODO: redirect to register page; unreachable: do above
        }
    }
    else {
        console.log("User is not authenticated");
        location.href = "index.html";
    }
});