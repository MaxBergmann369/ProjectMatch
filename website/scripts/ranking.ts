import { Card } from './card';
import {initKeycloak, keycloak} from "./keycloak";
import {Project, User} from "./models";
import {TokenUser} from "./tokenUser";
import {HttpClient} from "./server-client";
import "./general";
// this tells webpack to include the home.ts file in the bundle

let user: TokenUser = null;
let client : HttpClient = null;
let clicked: boolean = false;

export async function initRanking(tokenUser: TokenUser) {
    user = tokenUser;
    client = new HttpClient();

    let background: HTMLDivElement;

    const ranking = document.getElementById('rankingBtn');

    ranking.addEventListener('click', async () => {
        if(!clicked) {
            background = createRankingCard();
            await addContentToTable();
            background.style.display = 'flex';
            clicked = true;
        }
        else {
            background.style.display = 'none';
            clicked = false;
        }
    });
}

function createRankingCard() {
    const view = document.getElementsByClassName('projectView')[0];

    const background = document.createElement('div');
    background.classList.add('background');
    background.style.display = 'none';

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

async function addContentToTable() {
    const viewTableContent = document.getElementById('viewTableContent');
    const likeTableContent = document.getElementById('likeTableContent');
    const memberTableContent = document.getElementById('memberTableContent');


}