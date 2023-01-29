export class loadMoreBtn {
    constructor({selector, onClick, hidden = true}) {
        this.refs = this.getRefs(selector);
        document.querySelector(selector).addEventListener('click', onClick)
        hidden && this.hide();
    }
    getRefs(selector) {
        return {
            btn: document.querySelector(selector),
            icon: document.querySelector(`${selector} .icon`),
        }
    }

    show() {
        this.refs.btn.classList.remove('hidden');
    }

    hide() {
        this.refs.btn.classList.add('hidden');
    }

    disable() {
        this.refs.btn.disabled = true;
        this.refs.icon.classList.add('processing');
    }

    enable() {
        this.refs.btn.disabled = false;
        this.refs.icon.classList.remove('processing');
    }
}