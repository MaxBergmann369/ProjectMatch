import {HttpClient} from "./server-client";
import {initKeycloak, keycloak} from "./keycloak";
import {Ability, User} from "../../models";

const auth = initKeycloak();
document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await auth;

    if (!authenticated) {
        location.href = "index.html";
    }

    const client = new HttpClient();

    const user1: User | null = await client.getUser(keycloak.tokenParsed.preferred_username);

    if(user1 !== null) {
        location.href = "home.html";
    }

    await renderAbilities();

    document.getElementById("registerForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const username = data.get("username") as string;
        const birthdate = data.get("birthdate") as string;
        const response = await client.addUser(username, birthdate);
        if (response) {
            location.href = "home.html";
        } else {
            console.error("Failed to register user");
        }
    });
});

async function renderAbilities() {
    const client = new HttpClient();
    const abilities: Ability[] = await client.getAbilities();
    const abilitiesElement = document.getElementById("abilities");

    if (abilitiesElement !== null) {
        let html = "<h2>Abilities</h2>";
        const abilitiesMap: { [key: number]: Ability[] } = {};
        const topLevelAbilities: Ability[] = [];

        abilities.forEach(ability => {
            if (ability.parentId === null) {
                topLevelAbilities.push(ability);
            } else {
                if (!abilitiesMap[ability.parentId]) {
                    abilitiesMap[ability.parentId] = [];
                }
                abilitiesMap[ability.parentId].push(ability);
            }
        });

        const renderAbility = (ability: Ability, depth: number) => {
            html += `
            <div style="margin-left: ${depth * 20}px; border: 1px solid black; padding: 5px;">
                <input type="checkbox" id="ability_${ability.id}" name="abilities" value="${ability.id}" onchange="handleCheckboxChange(${ability.id}, this.checked)">
                <label for="ability_${ability.id}">${ability.name}</label>
            </div>
            `;

            if (abilitiesMap[ability.id]) {
                abilitiesMap[ability.id].forEach(child => renderAbility(child, depth + 1));
            }
        };

        topLevelAbilities.forEach(ability => renderAbility(ability, 0));

        abilitiesElement.innerHTML = html;
    }
}