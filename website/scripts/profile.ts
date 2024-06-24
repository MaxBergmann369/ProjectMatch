import {initKeycloak, keycloak} from "./keycloak";
import "./general";
import {HttpClient} from "./server-client";
import {TokenUser} from "./tokenUser";
import {Ability, Project} from "./models";
import {renderAbilities} from "./utils";

const authenticatedPromise = initKeycloak();
let abilities : Ability[];
let tokenUser: TokenUser;
document.addEventListener("DOMContentLoaded", async function () {
    const authenticated = await authenticatedPromise;
    if (!authenticated) {
        console.log("User is not authenticated");
        location.href = "index.html";
        return;
    }

    tokenUser = new TokenUser(keycloak.tokenParsed);
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    if (!id) {
        id = tokenUser.userId;
    }
    console.log(id);

    const client = new HttpClient();
    abilities = await client.getUserAbilities(id);
    if (abilities === null) {
        alert(`Sorry, it seems like the user with the id "${id}" doesn't exist.`);
        location.href = "home.html";
    }
    const showEdit = id === tokenUser.userId;
    await loadUserUI(client, id, showEdit);
    await loadProjectUI(client, id);
    addPopupEventListener();


});

async function loadProjectUI(client: HttpClient, id: string) {
    const projects = await client.getProjectsWhereUserIsMember(id);
    const projectList = document.getElementById("projectList");

    async function addProjectsToList(projects: Project[]) {
        projectList.innerHTML = "";
        for (const project of projects) {
            const div = document.createElement("div");
            div.classList.add("project");
            const spanName = document.createElement("span");
            spanName.classList.add("name");
            spanName.textContent = project.name;
            div.appendChild(spanName);

            if(project.ownerId === id) {
                const img = document.createElement("img");
                img.src = "./resources/crown.svg";
                div.appendChild(img);
            }

            const spanMembers = document.createElement("span");
            const members = await client.getProjectMembersCnt(project.id, true);

            spanMembers.textContent = `${members}/${project.maxMembers} Members`;
            div.appendChild(spanMembers);

            div.addEventListener("click", function () {
                location.href = `project.html?id=${project.id}`;
            });

            projectList.appendChild(div);
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



async function loadUserUI(client: HttpClient, id: string, showEdit:boolean) {
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
        pfp.src = `${HttpClient.pfpUrl}/${user.pfp}`;
    }
    const editBtn = document.getElementById("editProfile");
    const img = document.createElement("img");
    editBtn.append(img);

    if (showEdit) {
        editBtn.getElementsByTagName("img")[0].src = "./resources/pencil.svg";
        editBtn.addEventListener("click", async function () {
            const parent = document.getElementById("user");
            parent.classList.toggle("editing");
            if (parent.classList.contains("editing")) {
                editBtn.getElementsByTagName("img")[0].src = "./resources/save.svg";
                const usernameInput = document.getElementById("usernameEdit") as HTMLInputElement;
                usernameInput.value = user.username;
                const bioInput = document.getElementById("bioEdit") as HTMLInputElement;
                bioInput.value = user.biografie;
                await renderAbilities(client, "abilitiesEdit");
                for (const ability of abilities) {
                    const input = document.getElementById(`ability_${ability.id}`) as HTMLInputElement;
                    input.checked = true;
                }
                document.querySelectorAll(".ability input").forEach((input) => {
                    input.dispatchEvent(new Event("change"));
                });
            } else {
                editBtn.getElementsByTagName("img")[0].src = "./resources/pencil.svg";
                const usernameInput = document.getElementById("usernameEdit") as HTMLInputElement;
                const bioInput = document.getElementById("bioEdit") as HTMLInputElement;
                if (usernameInput.value !== user.username || bioInput.value !== user.biografie) {
                    await client.updateUser(id, usernameInput.value, bioInput.value);
                    username.textContent = usernameInput.value;
                    bio.textContent = bioInput.value;
                    user.username = usernameInput.value;
                    user.biografie = bioInput.value;
                }
                const abilitiesChecks = document.querySelectorAll(".ability input");
                const selectedAbilities: number[] = [];
                for (const ability of abilitiesChecks) {
                    if ((ability as HTMLInputElement).checked) {
                        selectedAbilities.push(parseInt((ability as HTMLInputElement).value));
                    }
                }
                await client.updateUserAbilities(id, selectedAbilities);
                abilities = await client.getUserAbilities(id);
                loadAbilities();
                const abElement = document.getElementById("abilitiesEdit");
                abElement.innerHTML = "";
            }
        });
    }
    else{
        editBtn.getElementsByTagName("img")[0].src = "./resources/profile/add-chat.svg";
        editBtn.addEventListener("click", async function () {
           const chatId = await client.addDirectChat(tokenUser.userId, user.userId);

           let id = parseInt(chatId);

           if(isNaN(id)){
               id = (await client.getDirectChat(tokenUser.userId, user.userId)).id;
           }

           location.href = `chat.html?chat=${id}`;
        });
    }

    const pfpInput = document.getElementById('pfpInput') as HTMLInputElement;
    pfpInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const imageBlob = new Blob([e.target.result], {type: 'image/jpeg'}); // Create a Blob object

                const newPfp = await client.uploadImage(imageBlob);

                if (newPfp !== null) {
                    pfp.src = `${HttpClient.pfpUrl}/${newPfp}`;
                }
            };
            reader.readAsArrayBuffer(this.files[0]); // Read the file as an ArrayBuffer
        }
    });

    loadAbilities();
    document.title = `${user.firstname} ${user.lastname}'s Profile - ProjectMatch`;
}

function loadAbilities(){
    const filteredAbilities = abilities.filter(ability => ability.parentId === 1 || ability.parentId === 2);
    const abilitiesList = document.getElementById("abilities");
    abilitiesList.innerHTML = "";
    for (const ability of filteredAbilities) {
        const span = document.createElement("span");
        span.textContent = ability.name;
        abilitiesList.appendChild(span);
    }
}


function addPopupEventListener() {
    document.getElementById("showmore").addEventListener("click", function () {
        if (document.getElementById("ability-popup")) {
            return; // If it's open, don't open it again
        }

        const el = document.createElement("div"); // popup
        el.id = "ability-popup";
        el.innerHTML = `
            <div id="popup-content">
                <img src="./resources/x.svg" id="close-popup" alt="Close popup">
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