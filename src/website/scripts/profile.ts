import {initKeycloak, keycloak} from "./keycloak";
import "./general";
import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";
import {Ability, Project} from "../../models";

const authenticatedPromise = initKeycloak();

const defaultImage = "default.jpg";

document.addEventListener("DOMContentLoaded", async function () {
    const authenticated = await authenticatedPromise;
    if (!authenticated) {
        console.log("User is not authenticated");
        location.href = "index.html";
        return;
    }
    const tokenUser = new TokenUser(keycloak.tokenParsed);
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    if (!id) {
        id = tokenUser.userId;
    }
    const client = new HttpClient();
    let abilities = await client.getUserAbilities(id); // todo: change to const and remove the line below
    abilities = await client.getAbilities(); // only for testing purposes
    await loadUserUI(client, abilities, id);
    await loadProjectUI(client, id);
    addPopupEventListener(abilities);


});

async function loadProjectUI(client: HttpClient, id: string) {
    const projects = await client.getProjectsWhereUserIsMember(id);
    const projectList = document.getElementById("projectList");

    function addProjectsToList(projects: Project[]) {
        projectList.innerHTML = "";
        for (const project of projects) {
            const a = document.createElement("a");
            a.classList.add("project");
            a.href = `project.html?id=${project.id}`;
            a.textContent = project.name;
            projectList.appendChild(a);
        }
    }
    addProjectsToList(projects);
    const myProjectsButton = document.getElementById("myProjects");
    myProjectsButton.addEventListener("click", async function () {
        const myProjects = await client.getProjectsWhereUserIsMember(id);
        addProjectsToList(myProjects);
    });
    const pendingReqButton = document.getElementById("pendingReqs");
    pendingReqButton.addEventListener("click", async function () {
        const pendingRequests = await client.getProjectsWhereUserIsMember(id, false);
        addProjectsToList(pendingRequests);
    });
    const favProjectsButton = document.getElementById("favProjects");
    favProjectsButton.addEventListener("click", async function () {
        const favProjects = await client.getProjectsLikedByUser(id);
        addProjectsToList(favProjects);
    });
}



async function loadUserUI(client: HttpClient, abilities: Ability[], id: string) {
    const user = await client.getUser(id);
    const username = document.getElementById("username");
    username.textContent = user.username;
    const firstname = document.getElementById("firstname");
    firstname.textContent = user.firstname;
    const lastname = document.getElementById("lastname");
    lastname.textContent = user.lastname;
    const birthdate = document.getElementById("birthdate").querySelector("span");
    // display date in dd.mm.yyyy format
    birthdate.textContent = new Date(user.birthdate).toLocaleDateString("de-DE");
    const pfp = document.getElementById("pfpImg") as HTMLImageElement;
    const bio = document.getElementById("bio");
    bio.textContent = user.biografie;

    const className = document.getElementById("class").querySelector("span");
    className.textContent = user.clazz;
    const department = document.getElementById("department").querySelector("span");
    // get short form
    department.textContent = user.department;

    if (user.pfp) {
        const path = `./resources/profile/pfp/${user.pfp}`;

        pfp.src = path;
    }

    const pfpInput = document.getElementById('pfpInput') as HTMLInputElement;
    pfpInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const imageBlob = new Blob([e.target.result], {type: 'image/jpeg'}); // Create a Blob object

                const newPfp = await client.uploadImage(user.userId, imageBlob);

                if (newPfp !== null) {
                    const path = `./resources/profile/pfp/${newPfp}`;

                    pfp.src = path;
                }
            };
            reader.readAsArrayBuffer(this.files[0]); // Read the file as an ArrayBuffer
        }
    });

    const filteredAbilities = abilities.filter(ability => ability.parentId === 1);
    const abilitiesList = document.getElementById("abilities");
    for (const ability of filteredAbilities) {
        const span = document.createElement("span");
        span.textContent = ability.name;
        span.classList.add("ability");
        abilitiesList.appendChild(span);
    }
    document.title = `${user.firstname} ${user.lastname}'s Profile - ProjectMatch`;
}

function addPopupEventListener(abilities: Ability[]) {
    document.getElementById("showmore").addEventListener("click", function () {
        if (document.getElementById("ability-popup")) {
            return; // If it's open, don't open it again
        }

        const el = document.createElement("div"); // popup
        el.id = "ability-popup";
        el.innerHTML = `
            <div id="popup-content">
                <img src="./resources/close.svg" id="close-popup" alt="Close popup">
                <div id="ability-list">
                </div>
            </div>
        `;
        el.querySelector("#close-popup").addEventListener("click", function () {
            el.remove();
        });
        document.body.appendChild(el);
        const list = document.getElementById("ability-list");

        function getAbilityElement(ability: Ability) {
            const li = document.createElement("li");
            const p = document.createElement("span");
            p.textContent = ability.name;
            li.appendChild(p);
            const subabilities = abilities.filter(a => a.parentId === ability.id);
            if (subabilities.length > 0) {
                const ul = document.createElement("ul");
                for (const subability of subabilities) {
                    ul.appendChild(getAbilityElement(subability));
                }
                li.appendChild(ul);
            }
            return li;
        }

        for (const ability of abilities.filter(a => a.parentId === null)) {
            list.appendChild(getAbilityElement(ability));
        }
    });
}

