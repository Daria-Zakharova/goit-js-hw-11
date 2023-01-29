export function renderMarkup({container, items, template}) {
    const markup = template(items);
    container.insertAdjacentHTML('beforeend', markup);
}