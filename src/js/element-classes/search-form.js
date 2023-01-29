import debounce from "lodash.debounce";
import { disableSubmitOnEmptyInput } from "../utils/disable-submit-on-empty-input";

export class searchForm {
    constructor ({onSubmit, selector = '.search-form'}) {
        this.refs = this.getRefs(selector);
        document.querySelector(selector).addEventListener('submit', onSubmit);
        this.activate();
    }
    getRefs(selector) {
        return {            
        form: document.querySelector(selector),
        input: document.querySelector(`${selector}__input`),
        submitBtn: document.querySelector(`${selector}__btn`),}
    }
    activate () {
        const checkEmptyinput = () => {disableSubmitOnEmptyInput({input: this.refs.input, button: this.refs.submitBtn})};
        this.refs.input.addEventListener('input', debounce(checkEmptyinput, 300));
        this.refs.form.addEventListener('submit', () => {
            this.refs.submitBtn.disabled = true;
        });
    }
};