import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';
import createGalleryCard from './js/templates/gallery-card.hbs';
import { getImages } from "./js/get-images";
import { loadMoreBtn } from './js/load-more-btn';
import { spinner } from './js/spinner';

const refs = {
    searchForm: document.querySelector('.search-form'),
    searchInput: document.querySelector('.search-form__input'),
    searchBtn: document.querySelector('.search-form__btn'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
    endMessage: document.querySelector('.end'),
}

const loadBtn = new loadMoreBtn({selector: '.load-more-btn', hidden: true});
const spinnerSearchBtn = new spinner(refs.searchBtn);
let query = null;
let lightbox = null;
let page = 1;
let pages = 0;

refs.searchForm.addEventListener('submit', onSubmit);
refs.searchInput.addEventListener('input', debounce(onInput, 300));
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

async function onSubmit(e) {

    e.preventDefault();
    query = e.currentTarget.elements.searchQuery.value;
    reset(e);
    refs.searchBtn.disabled = true;

    try {
        spinnerSearchBtn.loading();
        const picturesObj = await getImages(query, page);
        const pictures = await picturesObj.data.hits;

        if (!pictures.length) {
            spinnerSearchBtn.stopLoading();
            return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            
        }
    
        const picturesAmount = await picturesObj.data.totalHits;
        Notify.success(`Hooray! We found ${picturesAmount} images.`);
        spinnerSearchBtn.stopLoading();
    
        renderMarkup(pictures);   
        lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            showCounter: false,
        });
    
        pictures.length < picturesAmount && loadBtn.show();
        pictures.length === picturesAmount && refs.endMessage.classList.remove('hidden');
        pages = Math.ceil(picturesAmount / 40);
    }
    catch(e) {
        Notify.info(`Something is wrong. ${e.message}`);
        spinnerSearchBtn.stopLoading();
    }    
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
    
    try {
        page += 1;    
        loadBtn.disable();
        const pictures = await (await getImages(query, page)).data.hits;
        page === pages && loadBtn.hide() || loadBtn.enable();
        page === pages  && refs.endMessage.classList.remove('hidden');
                
        renderMarkup(pictures);

        scroll();

        lightbox.refresh();
    }
    catch(e) {
        Notify.info(`Something is wrong. ${e.message}`);
        loadBtn.enable();
    }
}

function renderMarkup(pictures) {
    const markup = createGalleryCard(pictures);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function reset(e) {
    e.currentTarget.reset();
    page = 1;
    refs.gallery.innerHTML = '';    
    loadBtn.hide();
    document.querySelector('body').removeAttribute('style');
    refs.endMessage.classList.add('hidden');
}

function scroll() {
    const height = document.documentElement.clientHeight * 0.9;
    const bodyHeight = document.querySelector('html').offsetHeight;
    document.querySelector('body').style.minHeight = `${bodyHeight + height}px`;    
    window.scrollBy({
        top: height,
        left: 0,
        behavior: "smooth",
        });
}