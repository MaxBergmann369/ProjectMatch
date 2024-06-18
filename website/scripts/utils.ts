import {HttpClient} from "./server-client";
import {Ability} from "./models";

export async function renderAbilities(client:HttpClient, elementId:string = "abilities") {
    const abilities: Ability[] = await client.getAbilities();
    const abilitiesElement = document.getElementById(elementId);

    if (abilitiesElement !== null) {
        let html = "";
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
            <div class="ability" style="margin-left: ${depth}rem;">
                <input type="checkbox" id="ability_${ability.id}" name="abilities" value="${ability.id}">
                <label for="ability_${ability.id}">${ability.name}</label>
            </div>
            
            `;

            if (abilitiesMap[ability.id]) {
                html += `<div class='children' id="children_${ability.id}">`;
                abilitiesMap[ability.id].forEach(child => renderAbility(child, depth + 1));
                html += "</div>";
            }
        };

        topLevelAbilities.forEach(ability => renderAbility(ability, 0));

        abilitiesElement.innerHTML = html;

        document.querySelectorAll(".ability input").forEach((input) => {
                input.addEventListener("change", (event) => {

                    const id = parseInt((event.target as HTMLInputElement).id.split("_")[1]);
                    const checked = (event.target as HTMLInputElement).checked;
                    const children = document.getElementById(`children_${id}`);
                    if (!children) {
                        return;
                    }
                    (children as HTMLElement).style.display = checked ? "block" : "none";
                    const childrenChildren = children.children;
                    if (!childrenChildren || childrenChildren.length === 0) {
                        return;
                    }
                    if (!checked) {
                        for (let i = 0; i < childrenChildren.length; i++) {
                            const child = childrenChildren.item(i);
                            if (child instanceof HTMLElement) {
                                const childInput = child.querySelector("input");
                                if (childInput) {
                                    (childInput as HTMLInputElement).checked = false;
                                    childInput.dispatchEvent(new Event("change"));
                                }
                            }
                        }
                    }
                });
            }
        );


    }

}

