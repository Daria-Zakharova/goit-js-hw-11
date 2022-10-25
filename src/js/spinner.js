export class spinner {

    constructor(selector) {
        this.icon = selector.querySelector('.icon');
    }

    loading() {

        this.icon.classList.add('loading');

    }

    stopLoading() {
        this.icon.classList.remove('loading');
    }
}