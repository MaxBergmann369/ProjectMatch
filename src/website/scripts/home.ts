import { Card } from './card';
import {initKeycloak, keycloak} from "./keycloak";
import {Role, User} from "../../models";
import {TokenUser} from "./tokenUser";
import {HttpClient} from "./server-client";
const authenticatedPromise = initKeycloak();

document.addEventListener("DOMContentLoaded", async function () {
    const authenticated = await authenticatedPromise;
    if (authenticated) {
        const client = new HttpClient();
        console.log("User is authenticated");
        const user = new TokenUser(keycloak.tokenParsed);


        const user1: User | null = await client.getUser(user.userId);

        if(user1 === null) {
            location.href = "register.html";
        }
    }
    else {
        console.log("User is not authenticated");
        location.href = "index.html";
    }

    // DOM
    const swiper = document.querySelector('#swiper');
    const like = document.querySelector('#like') as HTMLElement;
    const dislike = document.querySelector('#dislike') as HTMLElement;

// constants
    const urls = [];

    addImagesFromBgFolder();
    function addImagesFromBgFolder() {
        for (let i = 1; i <= 33; i++) {
            urls.push(`./resources/project/backgrounds/bg${i}.webp`);
        }
    }

// variables
    let cardCount = 0;

// functions
    function appendNewCard() {
        const card = new Card({
            imageUrl: urls[cardCount % urls.length],
            onDismiss: appendNewCard,
            onLike: () => {
                like.style.animationPlayState = 'running';
                like.classList.toggle('trigger');
            },
            onDislike: () => {
                dislike.style.animationPlayState = 'running';
                dislike.classList.toggle('trigger');
            }
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
});