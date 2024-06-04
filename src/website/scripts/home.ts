import { Card } from './card';
import {initKeycloak, keycloak} from "./keycloak";
import {Project, User} from "../../models";
import {TokenUser} from "./tokenUser";
import {HttpClient} from "./server-client";
import "./general";
import {initNotifications} from "./notifications"; // this tells webpack to include the general.ts file in the bundle

const authenticatedPromise = initKeycloak();
let client : HttpClient = null;

document.addEventListener("DOMContentLoaded", async function () {
    const authenticated = await authenticatedPromise;

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
    let allowRepeats = false;
    const projects: Project[] = [];
    for (let i = 1; i <= 33; i++) {
        urls.push(`./resources/project/backgrounds/bg${i}.webp`);
    }

// variables
    let cardCount = 0;

// functions
    await initNotifications(user);

    async function appendEndCard() {
        const card = new Card({
            id: 0,
            imageUrl: urls[cardCount % urls.length],
            onDismiss: () => {
                appendNewCard();
            },
            onLike: () => {
                like.style.animationPlayState = 'running';
                like.classList.toggle('trigger');
            },
            onDislike: () => {
                dislike.style.animationPlayState = 'running';
                dislike.classList.toggle('trigger');
            },
            onFavorite: () => {
            },
            favorite: false,
            title: "No more projects",
            desc: "You have seen all the projects! Check back later or continue swiping to see projects, you already have seen, again.",
            owner: user1,
            tags: []
        });
        swiper.append(card.element);
        cardCount++;
        const cards = swiper.querySelectorAll('.card:not(.dismissing)');
        cards.forEach((card: HTMLElement, index) => {
            card.style.setProperty('--i', index.toString());
        });
    }

    async function getNextProject() : Promise<Project> {
        if (projects.length === 0){
            let arr = await client.getProjects(allowRepeats);
            if ((!arr || arr.length === 0)) {
                if (!allowRepeats){
                    allowRepeats = true;
                    await appendEndCard();
                    return null;
                }
                arr = await client.getProjects(allowRepeats);
            }
            console.log(arr);

            projects.push(...arr);
        }
        return projects.shift();
    }

    async function appendNewCard() {
        const project = await getNextProject();
        if (!project){
            return;
        }
        const url = urls.includes(project.thumbnail) ? project.thumbnail : urls[cardCount % urls.length];
        const title = project.name;
        let desc = project.description;
        const ownerId = project.ownerId;
        const owner = await client.getUser(ownerId);

        if(owner === null){
            return;
        }

        let tags = (await client.getProjectAbilities(project.id)).map(value => value.name);
        const favourite = await client.isLiked(project.id, user.userId);
        if (tags.length > 6){
            tags= tags.slice(0,6);
        }
        if (desc.length > 500){
            const index = desc.lastIndexOf(" ", 500);
            if (index !== -1){
                desc = desc.substring(0, index) + "...";
            }
            else {
                desc = desc.substring(0, 500) + "...";
            }
        }
        const card = new Card({
            id: project.id,
            imageUrl: url,
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
            onFavorite: () => {
                client.addLike(project.id, user.userId).then((value) => {
                    if (!value){
                        client.deleteLike(project.id, user.userId);
                    }
                });
            },
            favorite: favourite,
            title:title,
            desc:desc,
            owner:owner,
            tags:tags
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
        await appendNewCard();
    }

    document.addEventListener('keyup', (e:KeyboardEvent) => {
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

window.addEventListener('beforeunload', async () => {
    await client.deleteData();
});