
import logoImg from '/img/logo.svg';

export class Logo {
    constructor(mainClassName) {
        this.mainClassName = mainClassName;
    }

    create() {
        const logo = document.createElement('a');
        logo.classList.add(`${this.mainClassName}__link-logo`);
        logo.href = '/';

        const imgLogo = new Image();
        imgLogo.src = logoImg;
        imgLogo.classList.add(`${this.mainClassName}__logo`);
        imgLogo.alt = 'Логотип мебельного маркета Koff';

        logo.append(imgLogo);

        return logo;
    }
}