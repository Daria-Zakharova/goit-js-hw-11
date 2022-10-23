import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';
import createGalleryCard from './js/templates/gallery-card.hbs';
import { getImages } from "./js/get-images";
import { loadMoreBtn } from './js/load-more-btn';

const refs = {
    searchForm: document.querySelector('.search-form'),
    searchInput: document.querySelector('.search-form__input'),
    searchBtn: document.querySelector('.search-form__btn'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
}

const loadBtn = new loadMoreBtn({selector: '.load-more-btn', hidden: true});
let query = null;
let lightbox = null;
let page = 1;
let pages = 0;

refs.searchForm.addEventListener('submit', onSubmit);
refs.searchInput.addEventListener('input', debounce(onInput, 300));
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

async function onSubmit(e) {
    e.preventDefault();
    reset();

    refs.searchBtn.disabled = true;
    
    query = e.currentTarget.elements.searchQuery.value;

    const picturesObj = await getImages(query, page);
    const pictures = await picturesObj.data.hits;

    if (!pictures.length) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    
    const picturesAmount = await picturesObj.data.totalHits;
    Notify.success(`Hooray! We found ${picturesAmount} images.`);
    
    renderMarkup(pictures);   
    lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        showCounter: false,
    });
    
    pictures.length < picturesAmount && loadBtn.show();
    pages = Math.ceil(picturesAmount / 40);
    
}

function onInput() {
    if(this.value.trim()) {
        refs.searchBtn.disabled = false;
    }
    else {
        refs.searchBtn.disabled = true;
    }
}

async function loadMoreImages() {
    page += 1;
    loadBtn.disable();
    const pictures = await (await getImages(query, page)).data.hits;
    page === pages && loadBtn.hide() || loadBtn.enable();
    
    renderMarkup(pictures);
    lightbox.refresh();
}

function renderMarkup(pictures) {
    const markup = createGalleryCard(pictures);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function reset() {
    page = 1;
    refs.gallery.innerHTML = '';    
    loadBtn.hide(); 
}