export class spinner {

    constructor(selector) {
        this.icon = document.querySelector(selector);
    }

    on() {

        this.icon.classList.add('loading');

    }

    off() {
        this.icon.classList.remove('loading');
    }
}