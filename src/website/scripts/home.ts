import { Card } from './card';
import {initKeycloak, keycloak} from "./keycloak";
import {Project, User} from "../../models";
import {TokenUser} from "./tokenUser";
import {HttpClient} from "./server-client";
import "./general"; // this tells webpack to include the general.ts file in the bundle

const authenticatedPromise = initKeycloak();

document.addEventListener("DOMContentLoaded", async function () {
    const authenticated = await authenticatedPromise;
    let client : HttpClient = null;
    if (!authenticated) {
        console.log("User is not authenticated");
        location.href = "index.html";
        return;
    }

    client = new HttpClient();
    console.log("User is authenticated");
    const user = new TokenUser(keycloak.tokenParsed);


    const user1: User | null = await client.getUser(user.userId);

    if (user1 === null) {
        location.href = "register.html";
    }

    // DOM
    const swiper = document.querySelector('#swiper');
    const like = document.querySelector('#like') as HTMLElement;
    const dislike = document.querySelector('#dislike') as HTMLElement;
    // constants
    const urls = [];
    const projects = await client.getProjects();
    console.log(projects);
    for (let i = 1; i <= 33; i++) {
        urls.push(`./resources/project/backgrounds/bg${i}.webp`);
    }

// variables
    let cardCount = 0;

// functions



    async function getNextProject() : Promise<Project> {
        if (projects.length === 0){
            projects.push(...await client.getProjects());
        }
        return projects.shift();
    }

    async function appendNewCard() {
        const project = await getNextProject();
        const title = project.name;
        const desc = project.description;
        const ownerId = project.ownerId;
        const owner = await client.getUser(ownerId);

        const card = new Card({
            imageUrl: urls[cardCount % urls.length],
            onDismiss: () =>{
                client.addView(project.id, user.userId);
                appendNewCard();
            },
            onLike: () => {
                like.style.animationPlayState = 'running';
                like.classList.toggle('trigger');
                client.addProjectMember(project.id, user.userId);
            },
            onDislike: () => {
                dislike.style.animationPlayState = 'running';
                dislike.classList.toggle('trigger');
            },
            title:title,
            desc:desc,
            owner:owner,
            tags:["TypeScript", "HTML", "CSS"] // TODO: get tags
        });
        swiper.append(card.element);
        cardCount++;

        const cards = swiper.querySelectorAll('.card:not(.dismissing)');
        cards.forEach((card: HTMLElement, index) => {
            card.style.setProperty('--i', index.toString());
        });
    }

// first 34 cards
    for (let i = 0; i < 5; i++) {
        appendNewCard();
    }

    document.addEventListener('keyup', (e:KeyboardEvent) => {
        console.log(e.key);
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const topCard = swiper.getElementsByClassName('card')[0];
        if (topCard.classList.contains('dismissing')) return;
        const event = new CustomEvent('dismiss', {
            detail: {
                direction: e.key === 'ArrowLeft' ? -1 : 1
            }
        });
        // get top card

        (topCard as HTMLElement).style.animationFillMode = 'forwards';
        topCard.animate([
            {transform: 'translateX(0) rotate(0)'},
            {transform: `translateX(${e.key === 'ArrowLeft' ? -100 : 100}vw) rotate(${e.key === 'ArrowLeft' ? -90 : 90}deg)`}
        ], {
            duration: 1250,
            easing: "ease"
        });
        topCard.dispatchEvent(event);
    });
});
