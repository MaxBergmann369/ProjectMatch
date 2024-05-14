import {HttpClient} from "./server-client";
import { initKeycloak} from "./keycloak";

import {Ability} from "../../models";

const authenticatedPromise = initKeycloak();

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await authenticatedPromise;
    if (authenticated) {
        console.log("User is authenticated");

        await renderAbilities();
    }
    else {
        console.log("User is not authenticated");
        location.href = "index.html";
    }
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
