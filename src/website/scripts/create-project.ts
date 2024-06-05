import {HttpClient} from "./server-client";
import {Ability, User} from "../../models";
import {initKeycloak, keycloak} from "./keycloak";
import * as path from 'path';
import http from "http";
import {ValProject} from "./validation";

const auth = initKeycloak();
let client;
let links = [];
const pictures :string[] = [];

for (let i = 1; i <= 33; i++) {
    pictures.push(`./resources/project/backgrounds/bg${i}.webp`);
}

let firstTimePicture = Math.floor(Math.random() * ((pictures.length - 1) + 1));

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await auth;

    if (!authenticated) {
        location.href = "index.html";
    }

    client = new HttpClient();

    await renderAbilities();

    await renderPicture();

    document.getElementById("add-link-button").addEventListener("click", async (event) => {
        event.preventDefault();
        await addLink();
    });

    const cerateProject = document.getElementById("add-picture-button");
    console.log(cerateProject);

    document.getElementById("add-picture-button").addEventListener("click", async (event) => {
        event.preventDefault();
        //await addPicture();
    });

    //console.log(document.getElementById("add-pic-button"));

    document.getElementById('create-project').addEventListener("submit", async (event) => {
        //event.preventDefault();
        console.log('enterd create project');
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);

        const abilities = data.getAll("abilities") as string[];
        const abilitiesIds = abilities.map(ability => parseInt(ability));

        console.log(abilities);
        const abResponse = await client.addProjectAbility(keycloak.tokenParsed.preferred_username, abilitiesIds);

        if (!abResponse) {
            alert("Failed to add ability to project");
        }

        const projectTitle = data.get("project-title") as string;
        const description = data.get("description") as string;
        const maxMembers = data.get("max-members") as string;
        //links
        const link = links.join(";\n");
        const picture = `./resources/project/backgrounds/bg${firstTimePicture}.webp`;

        console.log(projectTitle);
        console.log(keycloak.tokenParsed.preferred_username);
        console.log(picture);
        console.log(description);
        console.log(new Date());
        console.log(link);
        console.log(parseInt(maxMembers));


        if(ValProject.isValid(projectTitle, keycloak.tokenParsed.preferred_username, picture, description, new Date(), link, parseInt(maxMembers))) {
            const project = {
                id: 1,
                name: projectTitle,
                ownerId: keycloak.tokenParsed.preferred_username,
                thumbnail: picture,
                description: description,
                dateOfCreation: new Date(),
                links: link,
                maxMembers: parseInt(maxMembers)
            }
            const response = await client.addProject(project);

            if (response) {
                console.log('hello this is the response')
                console.log(response);
                location.href = "home.html";
            } else {
                console.error("Failed to create project");
            }
            console.log('hello this is the project not going in the if')
         }

    });
});

async function renderAbilities() {
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

async function addLink() {
    const link = document.getElementById("link") as HTMLInputElement;
    const linkElement = document.getElementById("add-link");
    if(link.value === ""){
        alert("There is no link to add");
        return;
    }

    let html = "";

    for(const loadLink of links) {
        console.log(loadLink);
        html += `
                   <li>
                        <a href="${loadLink}">${loadLink}</a>
                    </li>       
        `;
    }

    if (linkElement !== null) {
        html += `
                   <li>
                        <a href="${link.value}">${link.value}</a>
                    </li>       
        `;

        links.push(link.value);
        link.value = "";
    }
    linkElement.innerHTML = html;
}

let count = 0;
async function addPicture() {
    const pictureElement = document.getElementById("add-pic-button");
    if (pictureElement !== null) {
        let html = "";

        html += `
            <div class="add-pic">
                <input type="checkbox" id="pic_${count}" name="abilities" value="${count}">
                <label for="ability_${count}"><img src=${pictures[0]} alt="BackroundPicture"></label>
            </div>
            `;
        count++;
        pictureElement.innerHTML = html;

    }

}

async function renderPictures() {
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

async function renderPicture() {

    const pictureElement = document.getElementById("picture");

    if (pictureElement !== null) {
        let html = "";

            html += `
                <img src="./resources/project/backgrounds/bg${firstTimePicture}.webp" alt="BackroundPicture">
            `;
        pictureElement.innerHTML += html;
    }
}