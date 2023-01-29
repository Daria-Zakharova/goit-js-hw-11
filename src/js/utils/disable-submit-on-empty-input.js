export function disableSubmitOnEmptyInput({input, button}) {
    if(input.value.trim()) {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}