import Keycloak from "keycloak-js";


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


