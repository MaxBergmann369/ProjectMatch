import { Card } from './card';
import {initKeycloak, keycloak} from "./keycloak";
import {Project, User} from "./models";
import {TokenUser} from "./tokenUser";
import {HttpClient} from "./server-client";
import "./general";
import {SocketClient} from "./socket-client";
// this tells webpack to include the home.ts file in the bundle

let user: TokenUser = null;
let client : HttpClient = null;

export async function initRanking(tokenUser: TokenUser) {
    user = tokenUser;
    client = new HttpClient();

    let background: HTMLDivElement;

    background = createRankingCard();

    const ranking = document.getElementById('rankingBtn');

    window.addEventListener('click', async (event) => {
        if (!background.contains(event.target as Node) && event.target !== background) {
            background.style.display = 'none';
        }
    });

    ranking.addEventListener('click', async () => {
        if(background.style.display === 'none' || background.style.display === '') {
            await addTableContent();

            background.style.display = 'flex';
        }
        else {
            background.style.display = 'none';
        }
    });
}

function createRankingCard() {
    const view = document.getElementsByClassName('projectView')[0];

    const background = document.createElement('div');
    background.classList.add('background');
    background.style.display = 'none';

    const refresh = document.createElement('button');
    refresh.classList.add('refresh');
    const img = document.createElement('img');
    img.src = "resources/refresh.svg";
    img.alt = "Refresh";
    refresh.appendChild(img);

    refresh.addEventListener('click', async () => {
        await addTableContent();
    });

    background.appendChild(refresh);

    //title
    const title = document.createElement('h1');
    title.innerHTML = 'Ranking';
    background.appendChild(title);

    const tablesContainer = document.createElement('div');
    tablesContainer.classList.add('tables-container');

    //viewTable
    const viewTable = document.createElement('div');
    viewTable.classList.add('viewTable');

    const viewTableTitle = document.createElement('h2');
    viewTableTitle.innerHTML = 'Most Views';
    viewTable.appendChild(viewTableTitle);

    const viewTableContent = document.createElement('div');
    viewTableContent.id = 'viewTableContent';
    viewTable.appendChild(viewTableContent);

    //likeTable
    const likeTable = document.createElement('div');
    likeTable.classList.add('likeTable');

    const likeTableTitle = document.createElement('h2');
    likeTableTitle.innerHTML = 'Most Likes';
    likeTable.appendChild(likeTableTitle);

    const likeTableContent = document.createElement('div');
    likeTableContent.id = 'likeTableContent';
    likeTable.appendChild(likeTableContent);

    //memberTable
    const memberTable = document.createElement('div');
    memberTable.classList.add('memberTable');

    const memberTableTitle = document.createElement('h2');
    memberTableTitle.innerHTML = 'Most Members';
    memberTable.appendChild(memberTableTitle);

    const memberTableContent = document.createElement('div');
    memberTableContent.id = 'memberTableContent';
    memberTable.appendChild(memberTableContent);


    tablesContainer.appendChild(viewTable);
    tablesContainer.appendChild(likeTable);
    tablesContainer.appendChild(memberTable);
    background.appendChild(tablesContainer);
    view.appendChild(background);

    return background;
}

async function addTableContent() {
    const viewTableContent = document.getElementById('viewTableContent');
    const likeTableContent = document.getElementById('likeTableContent');
    const memberTableContent = document.getElementById('memberTableContent');

    viewTableContent.innerHTML = '';
    likeTableContent.innerHTML = '';
    memberTableContent.innerHTML = '';

    const projects: Project[][] = await client.getTop10Projects();

    const viewProjects = projects[0];
    const likeProjects = projects[1];
    const memberProjects = projects[2];

    for (let i = 0; i < viewProjects.length; i++) {
        const project = viewProjects[i][0];
        const view = viewProjects[i][1];
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.id = `v${String(project.id)}`;

        const name = document.createElement('h3');
        name.innerHTML = `${i+1}.&nbsp${project.name}`;
        projectDiv.appendChild(name);

        const views = document.createElement('span');
        const img = document.createElement('img');
        img.src = "resources/project/detail/view.svg";
        img.alt = "Views";
        views.innerHTML = `${view}`;
        projectDiv.appendChild(views);
        projectDiv.appendChild(img);

        viewTableContent.appendChild(projectDiv);
    }

    for (let i = 0; i < likeProjects.length; i++) {
        const project = likeProjects[i][0];
        const like = likeProjects[i][1];
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.id = `l${String(project.id)}`;

        const name = document.createElement('h3');
        name.innerHTML = `${i+1}.&nbsp${project.name}`;
        projectDiv.appendChild(name);

        const likes = document.createElement('span');
        const img = document.createElement('img');
        img.src = "resources/project/detail/star.svg";
        img.alt = "Likes";
        likes.innerHTML = `${like}`;
        projectDiv.appendChild(likes);
        projectDiv.appendChild(img);

        likeTableContent.appendChild(projectDiv);
    }

    for (let i = 0; i < memberProjects.length; i++) {
        const project = memberProjects[i][0];
        const member = memberProjects[i][1];
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.id = `m${String(project.id)}`;

        const name = document.createElement('h3');
        name.innerHTML = `${i+1}.&nbsp${project.name}`;
        projectDiv.appendChild(name);

        const members = document.createElement('span');
        const img = document.createElement('img');
        img.src = "resources/project/detail/user.svg";
        img.alt = "Members";
        members.innerHTML = `${member}/${project.maxMembers}`;
        projectDiv.appendChild(members);
        projectDiv.appendChild(img);

        memberTableContent.appendChild(projectDiv);
    }


}