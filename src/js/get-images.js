import axios from "axios";

export function getImages(query, page) {
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30786183-1701cbc3e014bdedf8e1f6ac3';
const params = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

return axios.get(`${BASE_URL}?key=${KEY}&${params}&q=${query}&page=${page}`);
}