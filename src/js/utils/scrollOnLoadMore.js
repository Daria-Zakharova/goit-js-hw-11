export function scroll() {
    const windowHeight = window.innerHeight;
    const nonGalleryHeight = document.querySelector('.header').getBoundingClientRect().height + document.querySelector('.load-more-btn').getBoundingClientRect().height;
    const scrollHeight = windowHeight - nonGalleryHeight;
    window.scrollBy({
        top: scrollHeight,
        left: 0,
        behavior: "smooth",
        });
}