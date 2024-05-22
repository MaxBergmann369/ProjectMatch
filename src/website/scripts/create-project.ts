import {HttpClient} from "./server-client";
import {Ability, User} from "../../models";
import {initKeycloak, keycloak} from "./keycloak";
import {ValProject} from "../../api/db/validation";
import * as path from 'path';


const auth = initKeycloak();
document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await auth;

    if (!authenticated) {
        location.href = "index.html";
    }

    const client = new HttpClient();

    await renderAbilities();

    await renderPicture();

    document.getElementById("add-link-button").addEventListener("submit", async (event) => {
        await addLink();
    });

    document.getElementById("add-pic-button").addEventListener("submit", async (event) => {
        await addPicture();
    });

    document.getElementById("create-project").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);

        const abilities = data.getAll("abilities") as string[];
        const abilitiesIds = abilities.map(ability => parseInt(ability));

        for(const abilityId of abilitiesIds) {
            const abResponse = await client.addProjectAbility(keycloak.tokenParsed.preferred_username, abilityId);

            if (!abResponse) {
                alert("Failed to add ability to project");
            }
        }

        const projectTitle = data.get("project-title") as string;
        const description = data.get("description") as string;
        const maxMembers = data.get("max-members") as string;
        const link = data.get("add-link") as string;


        /*if(ValProject.isValid(projectTitle, keycloak.tokenParsed.preferred_username, "hereWillBeAThumbnail", description, new Date(), link, parseInt(maxMembers))) {
            const project = {
                id: 1,
                name: projectTitle,
                ownerId: keycloak.tokenParsed.preferred_username,
                thumbnail: "hereWillBeAThumbnail",
                description: description,
                dateOfCreation: new Date(),
                links: link,
                maxMembers: parseInt(maxMembers)
            }
            const response = await client.addProject(project);

            if (response) {
                location.href = "home.html";
            } else {
                console.error("Failed to create project");
            }
         }
         */
    });
});

async function renderAbilities() {
    const client = new HttpClient();
    const abilities: Ability[] = await client.getAbilities();
    const abilitiesElement = document.getElementById("abilities");

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
                    if (checked) {
                        for (let i = 0; i < childrenChildren.length; i++) {
                            const child = childrenChildren.item(i);
                            if (child instanceof HTMLElement) {
                                console.log("Entered child if")
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

let counter = 0;

async function addLink() {
    const client = new HttpClient();
    const linkElement = document.getElementById("add-link");

    if (linkElement !== null) {
        let html = "";

        const renderLink = (link: String) => {
            counter++;

            html += `
            <div class="add-link">
                <input type="checkbox" id="link_${counter}" name="abilities" value="${counter}">
                <label for="link_${counter}"><a href="${link}">${link}</a></label>
            </div>
            
            `;
        };
    }

}


async function addPicture() {
    const client = new HttpClient();
    const linkElement = document.getElementById("add-link");

    if (linkElement !== null) {
        let html = "";

        const renderLink = (link: String) => {
            counter++;

            html += `
            <div class="add-link">
                <input type="checkbox" id="link_${counter}" name="abilities" value="${counter}">
                <label for="link_${counter}"><a href="${link}">${link}</a></label>
            </div>
            
            `;
        };
    }

}

async function renderPicture() {
    const client = new HttpClient();

    const folderPath = './resources/project/backgrounds'; // src/website
    const pictures :string[] = [];

    addImagesFromBgFolder();
    function addImagesFromBgFolder() {
        for (let i = 1; i <= 33; i++) {
            pictures.push(`./resources/project/backgrounds/bg${i}.webp`);
        }
    }

    let randomNumber = Math.floor(Math.random() * ((pictures.length - 1) + 1));

    const pictureElement = document.getElementById("add-pic");

    if (pictureElement !== null) {
        let html = "";

        let count = 0;
        for(const picture of pictures) {
            html += `
            <div class="add-pic">
                <input type="checkbox" id="pic_${count}" name="abilities" value="${count}">
                <label for="ability_${count}"><img src=${picture} alt="BackroundPicture"></label>
            </div>
            `;
        }


        pictureElement.innerHTML = html;

        document.querySelectorAll(".picture input").forEach((input) => {
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
                    if (checked) {
                        for (let i = 0; i < childrenChildren.length; i++) {
                            const child = childrenChildren.item(i);
                            if (child instanceof HTMLElement) {
                                console.log("Entered child if")
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