import "./general";
import {initKeycloak, keycloak} from "./keycloak";
import {HttpClient} from "./server-client";
import {Ability, Project, User} from "../models";
import {TokenUser} from "./tokenUser";
const authenticatedPromise = initKeycloak();

let client: HttpClient;
document.addEventListener("DOMContentLoaded", async() => {
    const auth = await authenticatedPromise;
    if (!auth) {
        console.log("User is not authenticated");
        location.href = "index.html";
        return;
    }

    const user = new TokenUser(keycloak.tokenParsed);

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get("id"));
    if (!id || isNaN(id)) {
        console.log("No id specified");
        location.href = "home.html";
        return;
    }

    client = new HttpClient();
    const project:Project = await client.getProject(id);
    const name = document.getElementById("project-name");
    const description = document.getElementById("description");

    if (!project) {
        name.textContent = "Project not found";
        description.textContent = "The project you are looking for does not exist.";
        return;
    }
    name.textContent = project.name;
    description.textContent = project.description;
    const projectMembers:User[] = await client.getProjectMembers(id);
    loadMembers(projectMembers,project.ownerId, project.maxMembers);
    const projectAbilities:Ability[] = await client.getProjectAbilities(id);
    loadProjectAbilities(projectAbilities);
    const urls = project.links.split(";");
    loadLinks(urls);
    const views = await client.getViews(id);
    const favs = await client.getLikes(id);
    const viewsElement = document.getElementById("viewcount");
    const favsElement = document.getElementById("favcount");
    viewsElement.textContent = views;
    favsElement.textContent = favs;

    if(project.ownerId === user.userId) {
        await handleProjectOwner(project);
    }
});

let switched: boolean = false;

function handleProjectOwner(project: Project) {
    const switchBtn = document.getElementById("switch");

    switchBtn.addEventListener("click", async () => {
        const title = document.getElementById("title");

        let members:User[] = [];

        if(!switched) {
            title.textContent = "Requests";
            members = await client.getProjectMembers(project.id, false);
            await loadMembers(members, project.ownerId, members.length);
        } else {
            title.textContent = "Members";
            members = await client.getProjectMembers(project.id);
            await loadMembers(members, project.ownerId, project.maxMembers);
        }

        switched = !switched;
    });
}

function loadMembers(projectMembers:User[],ownerId:string, maxMembers: number) {
    const members = document.getElementById("members");

    const membersCnt = document.getElementById("membersCnt");
    membersCnt.textContent = `(${projectMembers.length}/${maxMembers})`;

    members.innerHTML = "";
    for (const member of projectMembers) {
        const fullName = `${member.firstname} ${member.lastname}`;
        const div = document.createElement("div");
        div.classList.add("member");
        const img = document.createElement("img");
        img.classList.add("pfp");
        img.alt = `${fullName}'s Profile Picture`;
        img.src = member.pfp? `${HttpClient.pfpUrl}/${member.pfp}` : "resources/profile/pfp/default.jpg";
        const div2 = document.createElement("div");
        const p = document.createElement("p");
        p.textContent = fullName;
        if (member.userId === ownerId) {
            const img2 = document.createElement("img");
            img2.src = "resources/crown.svg";
            img2.alt = "Owner";
            p.appendChild(img2);
        }
        div2.appendChild(p);
        div.appendChild(img);
        div.appendChild(div2);
        div.addEventListener("click", () => {
            location.href = `profile.html?id=${member.userId}`;
        });
        members.appendChild(div);
    }
}

function loadProjectAbilities(projectAbilites:Ability[]){
    const abilities = document.getElementById("ability-list");
    abilities.innerHTML = "";
    for (const ability of projectAbilites) {
        const div = document.createElement("div");
        div.textContent = ability.name;
        abilities.appendChild(div);
    }
}

function loadLinks(urls:string[]){
    const links = document.getElementById("links");
    links.innerHTML = "";
    for (const url of urls) {
        const a = document.createElement("a");
        a.textContent = url;
        a.href = url;
        a.target = "_blank";
        links.appendChild(a);
    }
}