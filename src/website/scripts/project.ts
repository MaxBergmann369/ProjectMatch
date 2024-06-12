import "./general";
import {initKeycloak} from "./keycloak";
import {HttpClient} from "./server-client";
import {Project} from "../../models";
const authenticatedPromise = initKeycloak();

document.addEventListener("DOMContentLoaded", async() => {
    const auth = await authenticatedPromise;
    if (!auth) {
        console.log("User is not authenticated");
        location.href = "index.html";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get("id"));
    if (!id || isNaN(id)) {
        console.log("No id specified");
        location.href = "home.html";
        return;
    }

    const client = new HttpClient();
    const project:Project = await client.getProject(id);
    const name = document.getElementById("project-name");
    const description = document.getElementById("description");

    if (!project) {
        name.textContent = "Project not found";
        description.textContent = "The project you are looking for does not exist.";
        return;
    }
    console.log(project);
    name.textContent = project.name;
    description.textContent = project.description;
    const projectMembers = await client.getProjectMembers(id);

    const members = document.getElementById("members");
    for (const member of projectMembers) {
        const fullName = `${member.firstname} ${member.lastname}`;
        const div = document.createElement("div");
        div.classList.add("member");
        const img = document.createElement("img");
        img.classList.add("pfp");
        img.alt = `${fullName}'s Profile Picture`;
        img.src = member.pfp? `resources/profile/pfp/${member.pfp}` : "resources/profile/pfp/default.svg";
        const div2 = document.createElement("div");
        const p = document.createElement("p");
        p.textContent = fullName;
        if (member.userId === project.ownerId) {
            const img2 = document.createElement("img");
            img2.src = "resources/crown.svg";
            img2.alt = "Owner";
            p.appendChild(img2);
        }
        div2.appendChild(p);
        div.appendChild(img);
        div.appendChild(div2);
        members.appendChild(div);
    }
    const projectAbilities = await client.getProjectAbilities(id);
    const views = await client.getViews(id);
    const favs = await client.getLikes(id);

});

function loadMembers() {
    // TODO
}

function loadProject(){
    // TODO
}