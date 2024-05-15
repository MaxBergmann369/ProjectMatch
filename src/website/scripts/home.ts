import { Card } from './card';
document.addEventListener("DOMContentLoaded", function() {
    // DOM
    const swiper = document.querySelector('#swiper');
    const like = document.querySelector('#like') as HTMLElement;
    const dislike = document.querySelector('#dislike') as HTMLElement;

// constants
    const urls = [];

    addImagesFromBgFolder();
    function addImagesFromBgFolder() {
        for (let i = 1; i <= 34; i++) {
            urls.push(`./resources/project/backgrounds/bg${i}.jpg`);
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