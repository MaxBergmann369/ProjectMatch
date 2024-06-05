import {User} from "../../models";

export class Card {
    imageUrl: string;
    onDismiss: () => void;
    onLike: () => void;
    onDislike: () => void;
    onFavorite: () => void;
    favorite: boolean;
    element: HTMLElement;
    title: string;
    desc: string;
    owner: User;
    tags: string[];

    constructor({
                    imageUrl,
                    onDismiss,
                    onLike,
                    onDislike,
                    onFavorite,
                    favorite,
                    title,
                    desc,
                    owner,
                    tags
                }) {
        this.imageUrl = imageUrl;
        this.onDismiss = onDismiss;
        this.onLike = onLike;
        this.onDislike = onDislike;
        this.onFavorite =onFavorite;
        this.favorite = favorite;
        this.title = title;
        this.desc = desc;
        this.owner = owner;
        this.tags = tags;

        this.init();
    }

    // private properties
    private startPoint : { x: number, y: number };
    private offsetX : number;
    private offsetY : number;

    private isTouchDevice = () => {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0));
    };

    private init = () => {
        // add keypress event listener for a and d for like and dislike without it triggering periodically

        this.element = this.createCardElement();
        this.element.addEventListener('dblclick', this.handleDoubleClick);

        if (this.isTouchDevice()) {
            this.listenToTouchEvents();
        } else {
            this.listenToMouseEvents();
        }
        this.element.addEventListener('dismiss', (e:CustomEvent) => {

            this.dismiss(e.detail.direction, false);
        });

    };

    private handleDoubleClick = () => {
        this.element.classList.add('spin');
        setTimeout(() => {
            this.element.classList.remove('spin');
        }, 2000);
        setTimeout(() => window.location.href = 'detailView.html', 1800);
    };

    private listenToTouchEvents = () => {
        this.element.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            if (!touch) return;
            const { clientX, clientY } = touch;
            this.startPoint = { x: clientX, y: clientY };
            document.addEventListener('touchmove', this.handleTouchMove);
            this.element.style.transition = 'transform 0s';
        });

        document.addEventListener('touchend', this.handleTouchEnd);
        document.addEventListener('cancel', this.handleTouchEnd);
    };

    private listenToMouseEvents = () => {
        this.element.addEventListener('mousedown', (e) => {
            const { clientX, clientY } = e;
            this.startPoint = { x: clientX, y: clientY };
            document.addEventListener('mousemove', this.handleMouseMove);
            this.element.style.transition = 'transform 0s';
        });

        document.addEventListener('mouseup', this.handleMoveUp);

        // prevent card from being dragged
        this.element.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    };

    private handleMove = (x:number, y:number) => {
        this.offsetX = x - this.startPoint.x;
        this.offsetY = y - this.startPoint.y;
        const rotate = this.offsetX * 0.1;
        this.element.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) rotate(${rotate}deg)`;
        // dismiss card
        if (Math.abs(this.offsetX) > this.element.clientWidth * 0.7) {
            this.dismiss(this.offsetX > 0 ? 1 : -1, true);
        }
    };

    // mouse event handlers
    private handleMouseMove = (e:MouseEvent) => {
        e.preventDefault();
        if (!this.startPoint) return;
        const { clientX, clientY } = e;
        this.handleMove(clientX, clientY);
    };

    private handleMoveUp = () => {
        this.startPoint = null;
        document.removeEventListener('mousemove', this.handleMouseMove);
        this.element.style.transform = '';
    };

    // touch event handlers
    private handleTouchMove = (e:TouchEvent) => {
        if (!this.startPoint) return;
        const touch = e.changedTouches[0];
        if (!touch) return;
        const { clientX, clientY } = touch;
        this.handleMove(clientX, clientY);
    };

    private handleTouchEnd = () => {
        this.startPoint = null;
        document.removeEventListener('touchmove', this.handleTouchMove);
        this.element.style.transform = '';
    };

    public dismiss = (direction:number, animation:boolean) => {
        this.startPoint = null;
        document.removeEventListener('mouseup', this.handleMoveUp);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('touchmove', this.handleTouchMove);
        if (animation) {
            this.element.style.transition = 'transform 1s';
            this.element.style.transform = `translate(${direction * window.innerWidth}px, ${this.offsetY}px) rotate(${90 * direction}deg)`;
            this.element.classList.add('dismissing');
            setTimeout(() => {
                this.element.remove();
            }, 1000);
        }
        else{
            this.element.classList.add('dismissing');
            setTimeout(() => {
                this.element.remove();
            }, 1000);
        }
        if (typeof this.onDismiss === 'function') {
            this.onDismiss();
        }
        if (typeof this.onLike === 'function' && direction === 1) {
            this.onLike();
        }
        if (typeof this.onDislike === 'function' && direction === -1) {
            this.onDislike();
        }
    };
    
    private createCardElement = () => {
        const card = document.createElement('div');
        const fullname = `${this.owner.firstname} ${this.owner.lastname}`;
        card.classList.add('card');
        card.style.backgroundImage = `url(${this.imageUrl})`;
        const title = document.createElement('div');
        title.classList.add('title');
        const h2 = document.createElement('h2');
        h2.textContent = this.title;
        title.append(h2);
        const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-star\"><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/></svg>";
        const star = document.createElement('span');
        star.addEventListener('click', () => {
            star.classList.toggle('active');
            this.onFavorite();
        });

        if (this.favorite) {
            star.classList.add('active');
        }

        star.innerHTML = svg;
        title.append(star);
        const desc = document.createElement('p');
        desc.classList.add('desc');
        desc.textContent = this.desc;
        const owner = document.createElement('div');
        owner.classList.add('owner');
        const ownerPfp = document.createElement('img');
        ownerPfp.src = 'https://imgs.search.brave.com/jDiz6N9Qc7I67qoWe7mVB-bQ2kAoxUVD1hu4OwNHzXM/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzY2LzM5LzU0/LzM2MF9GXzE2NjM5/NTQwMl9VY2JhUzVa/NVRqMXJFYk12emhI/UjFVN0RwQ2dDV2Qz/ci5qcGc';
        ownerPfp.alt = fullname + "'s Profile Picture"; //'Owner Profile Picture';
        owner.append(ownerPfp);
        const ownerName = document.createElement('span');
        ownerName.textContent = 'Owner: ' + fullname;
        owner.append(ownerName);
        const tags = document.createElement('div');
        tags.classList.add('tags');
        this.tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            tags.append(span);
        });
        card.append(title);
        card.append(desc);
        card.append(owner);
        card.append(tags);
        return card;
    };
}