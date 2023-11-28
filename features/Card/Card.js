import { API_URL } from "../../const";
import { CartButton } from "../CartButton/CartButton";
import { LikeButton } from "../LikeButton/LikeButton";

export class Card {
    constructor({ id, image, title, price }) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.price = price;
        this.cartButton = new CartButton('card__btn', 'В корзину');
        this.likeButton = new LikeButton('card__favorite');
    }

    create() {
        const article = document.createElement('article');
        article.classList.add('goods__card', 'card');

        const link = document.createElement('a');
        link.classList.add('card__link', 'card__link_img');
        link.href = `/product/${this.id}`;

        const img = document.createElement('img');
        img.classList.add('card__img');
        img.alt = this.title;
        img.src = `${API_URL}${this.image}`;

        link.append(img);

        const info = document.createElement('div');
        info.classList.add('card__info');

        const title = document.createElement('h3');
        title.classList.add('card__title');

        const linkTitle = document.createElement('a');
        linkTitle.classList.add('card__link');
        linkTitle.textContent = this.title;
        linkTitle.href = `/product/${this.id}`;

        title.append(linkTitle);

        const price = document.createElement('p');
        price.classList.add('card__price');
        price.innerHTML = `${this.price.toLocaleString()}&nbsp;₽`;

        info.append(title, price);

        const btnCart = this.cartButton.create(this.id);
        const btnFavorite = this.likeButton.create(this.id);

        article.append(link, info, btnCart, btnFavorite);

        return article;
    }
}