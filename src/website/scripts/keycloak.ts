import Keycloak from "keycloak-js";


export const keycloak = new Keycloak({
    url: "https://auth.htl-leonding.ac.at",
    realm: "htl-leonding",
    clientId: "htlleonding-service"
});

export async function initKeycloak() {
    try {
        const origin = window.location.origin;
        const pathname = window.location.pathname;

        const desiredPath = pathname.substring(0, pathname.lastIndexOf('/'));
        const fullUrl = origin + desiredPath;
        return await keycloak.init({
            onLoad: "check-sso",
            flow: "implicit",
            pkceMethod: 'S256',
            // enableLogging: true,
            silentCheckSsoRedirectUri:
                fullUrl + '/silent-check-sso.html',
        });
    }
    catch (error) {
        console.error("Keycloak initialization failed", error);
        return false;
    }
}


