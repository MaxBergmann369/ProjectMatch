import {HttpClient} from "./server-client";
import "./general";
import {initKeycloak, keycloak} from "./keycloak";
import {ValProject} from "./validation";
import {renderAbilities} from "./utils";

const auth = initKeycloak();
let client: HttpClient;
const links = [];
const pictures :string[] = [];

for (let i = 1; i <= 33; i++) {
    pictures.push(`./resources/project/backgrounds/bg${i}.webp`);
}
let selection= Math.floor(Math.random() * (pictures.length - 1));



async function showPictureSelectionPopup() {
    const popup = document.getElementById("popup-pictures");

    if (popup) {
        popup.style.display = "flex";
        document.getElementById("close").addEventListener("click", () => {
            popup.style.display = "none";
        });
        for (let i = 0; i < pictures.length; i++) {
            const img = document.createElement("img");
            img.src = pictures[i];
            img.classList.add("popup-picture");
            img.addEventListener("click", () => {
                selection = i;
                renderPicture(selection);
                popup.style.display = "none";
            });
            popup.appendChild(img);
        }
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await auth;

    if (!authenticated) {
        location.href = "index.html";
    }

    client = new HttpClient();
    
    await renderAbilities(client);

    renderPicture(selection);

    document.getElementById("add-link-button").addEventListener("click", async (event) => {
        event.preventDefault();
        await addLink();
    });

    document.getElementById("add-picture-button").addEventListener("click", async (event) => {
        event.preventDefault();
        await showPictureSelectionPopup();
    });

    document.getElementById('create-project').addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);

        const projectTitle = data.get("project-name") as string;
        const description = data.get("description") as string;
        const maxMembers = data.get("max-member") as string;
        const link = links.join(";\n");
        const picture = `./resources/project/backgrounds/bg${selection}.webp`;

        if(ValProject.isValid(projectTitle, keycloak.tokenParsed.preferred_username, picture, description, new Date(), link, parseInt(maxMembers))) {

            const project = {
                id: 0,
                name: projectTitle,
                ownerId: keycloak.tokenParsed.preferred_username,
                thumbnail: picture,
                description: description,
                dateOfCreation: new Date(),
                links: link,
                maxMembers: parseInt(maxMembers)
            };

            const projectId = parseInt(await client.addProject(project));
            console.log('Project id: ',projectId);

            if (projectId < 0) {
                console.error("Failed to create project");
         }

        const abilities = data.getAll("abilities") as string[];
        const abilitiesIds = abilities.map(ability => parseInt(ability));
        console.log(abilitiesIds);
        console.log(abilities);

        const abResponse = await client.addProjectAbilities(projectId, abilitiesIds);

        if (!abResponse) {
            alert("Failed to add ability to project");
        }

        location.href = "home.html";
        }
    });
});
//
// async function renderAbilities() {
//     const abilities: Ability[] = await client.getAbilities();
//     const abilitiesElement = document.getElementById("abilities");
//
//     if (abilitiesElement !== null) {
//         let html = "";
//         const abilitiesMap: { [key: number]: Ability[] } = {};
//         const topLevelAbilities: Ability[] = [];
//
//         abilities.forEach(ability => {
//             if (ability.parentId === null) {
//                 topLevelAbilities.push(ability);
//             } else {
//                 if (!abilitiesMap[ability.parentId]) {
//                     abilitiesMap[ability.parentId] = [];
//                 }
//                 abilitiesMap[ability.parentId].push(ability);
//             }
//         });
//
//         const renderAbility = (ability: Ability, depth: number) => {
//             html += `
//             <div class="ability" style="margin-left: ${depth}rem;">
//                 <input type="checkbox" id="ability_${ability.id}" name="abilities" value="${ability.id}">
//                 <label for="ability_${ability.id}">${ability.name}</label>
//             </div>
//
//             `;
//
//             if (abilitiesMap[ability.id]) {
//                 html += `<div class='children' id="children_${ability.id}">`;
//                 abilitiesMap[ability.id].forEach(child => renderAbility(child, depth + 1));
//                 html += "</div>";
//             }
//         };
//
//         topLevelAbilities.forEach(ability => renderAbility(ability, 0));
//
//         abilitiesElement.innerHTML = html;
//
//         document.querySelectorAll(".ability input").forEach((input) => {
//                 input.addEventListener("change", (event) => {
//
//                     const id = parseInt((event.target as HTMLInputElement).id.split("_")[1]);
//                     const checked = (event.target as HTMLInputElement).checked;
//                     const children = document.getElementById(`children_${id}`);
//                     if (!children) {
//                         return;
//                     }
//                     (children as HTMLElement).style.display = checked ? "block" : "none";
//                     const childrenChildren = children.children;
//                     if (!childrenChildren || childrenChildren.length === 0) {
//                         return;
//                     }
//                     if (checked) {
//                         for (let i = 0; i < childrenChildren.length; i++) {
//                             const child = childrenChildren.item(i);
//                             if (child instanceof HTMLElement) {
//                                 const childInput = child.querySelector("input");
//                                 if (childInput) {
//                                     (childInput as HTMLInputElement).checked = false;
//                                     childInput.dispatchEvent(new Event("change"));
//                                 }
//                             }
//                         }
//                     }
//                 });
//             }
//         );
//         topLevelAbilities.forEach(ability => {
//             const input = document.getElementById(`ability_${ability.id}`) as HTMLInputElement;
//             if (input) {
//                 input.dispatchEvent(new Event("change"));
//             }
//         });
//     }
//
// }

async function addLink() {
    const link = document.getElementById("link") as HTMLInputElement;
    const linkElement = document.getElementById("add-link");
    if(link.value === ""){
        alert("There is no link to add");
        return;
    }
    const regex = /^(?:http|https):\/\/[^!@#$%^&*()-_=+[\]{}\\|;:'"<>,.?/ ]+\.[a-zA-Z]+$/;

    if (!regex.test(link.value)) {
        alert("Invalid link");
        return;
    }
    let html = "";

    for(const loadLink of links) {
        html += `
                   <li>
                        <button class="remove-link"><img src="./resources/x.svg" alt="remove link"></button>
                        <a href="${loadLink}">${loadLink}</a>
                       
                    </li>       
        `;
    }

    if (linkElement !== null) {
        html += `
                   <li>
                        <button class="remove-link"><img src="./resources/x.svg" alt="remove link"></button>
                        <a href="${link.value}">${link.value}</a>
                        
                    </li>       
        `;

        links.push(link.value);
        link.value = "";
    }
    linkElement.innerHTML = html;
    linkElement.querySelectorAll("li .remove-link").forEach((element) => {
        element.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const link = (element as HTMLElement).nextElementSibling as HTMLAnchorElement;
            const linkIndex = links.indexOf(link.textContent);
            if (linkIndex !== -1) {
                links.splice(linkIndex, 1);
            }
            link.parentElement.remove();
        });
    });
}

function renderPicture(index: number) {

    const pictureElement = document.getElementById("picture-preview") as HTMLImageElement;
    pictureElement.src = pictures[index];
}