import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import createGalleryCard from './js/templates/gallery-card.hbs';
import { getImages } from "./js/get-images";
import { loadMoreBtn } from './js/element-classes/load-more-btn';
import { spinner } from './js/element-classes/spinner';
import { searchForm } from './js/element-classes/search-form';
import { scroll } from './js/utils/scrollOnLoadMore';
import { renderMarkup } from './js/utils/renderMarkupInContainer';

const refs = {
    gallery: document.querySelector('.gallery'),
    endMessage: document.querySelector('.end'),
}

const searchForm = new searchForm({onSubmit});
const loadBtn = new loadMoreBtn({selector: '.load-more-btn', onClick: loadMoreImages, hidden: true});
const spinnerSearchBtn = new spinner('.search-form__btn .icon');

let query = null;
let lightbox = null;
let page = 1;
let pages = 0;


async function onSubmit(e) {

    e.preventDefault();
    query = e.currentTarget.elements.searchQuery.value;
    reset();

    try {
        spinnerSearchBtn.on();
        const picturesObj = await(await getImages(query, page)).data;
        const pictures = picturesObj.hits;

        if (!pictures.length) {
            spinnerSearchBtn.off();
            return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            
        }
    
        const picturesAmount = await picturesObj.totalHits;
        Notify.success(`Hooray! We found ${picturesAmount} images.`);
        spinnerSearchBtn.off();
    
        renderMarkup({container: refs.gallery, items:pictures, template: createGalleryCard});   
            lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            showCounter: false,
        });
    
        pictures.length < picturesAmount && loadBtn.show();
        pictures.length === picturesAmount && refs.endMessage.classList.remove('hidden');
        pages = Math.ceil(picturesAmount / 40);
    }
    catch(e) {
        Notify.failure(`Something is wrong. ${e.message}`);
        spinnerSearchBtn.off();
    }    
}

async function loadMoreImages() {
    
    try {
        page += 1;    
        loadBtn.disable();
        const pictures = await (await getImages(query, page)).data.hits;
        page === pages && loadBtn.hide() || loadBtn.enable();
        page === pages  && refs.endMessage.classList.remove('hidden');
                
        renderMarkup({container: refs.gallery, items:pictures, template: createGalleryCard});

        scroll();

        lightbox.refresh();
    }

    catch(e) {
        Notify.info(`Something is wrong. ${e.message}`);
        loadBtn.enable();
    }
}

function reset() {
    page = 1;
    refs.gallery.innerHTML = '';    
    loadBtn.hide();
    document.querySelector('body').removeAttribute('style');
    refs.endMessage.classList.add('hidden');
}

