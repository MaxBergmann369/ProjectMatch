import { Card } from './card';

document.addEventListener("DOMContentLoaded", function() {
    // DOM
    const swiper = document.querySelector('#swiper');
    const like = document.querySelector('#like') as HTMLElement;
    const dislike = document.querySelector('#dislike') as HTMLElement;

// constants
    const urls = [
        'https://source.unsplash.com/random/1000x1000/?sky',
        'https://source.unsplash.com/random/1000x1000/?landscape',
        'https://source.unsplash.com/random/1000x1000/?ocean',
        'https://source.unsplash.com/random/1000x1000/?moutain',
        'https://source.unsplash.com/random/1000x1000/?forest'
    ];

// variables
    let cardCount = 0;

// functions
    function appendNewCard() {
        const card = new Card({
            imageUrl: urls[cardCount % 5],
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

// first 5 cards
    for (let i = 0; i < 5; i++) {
        appendNewCard();
    }

});