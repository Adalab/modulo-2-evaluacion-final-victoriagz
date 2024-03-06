'use strict';

const list = document.querySelector('#list');
const favoritesContainer = document.querySelector('#favorite-list');

const GET_FAVORITES_KEY = 'favoritesList';

const FAKED_IMAGE_URL =
    'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png';

const DEFAULT_IMAGE =
    'https://st4.depositphotos.com/20858482/38056/v/450/depositphotos_380564934-stock-illustration-smile-icon-happy-face-symbol.jpg';

let animeList = [];

function onHandleFavoriteClick(event) {
    const clickedElement = event.target.parentElement;
    const elementIndex = Array.from(list.children).indexOf(clickedElement);
    const foundElement = animeList[elementIndex];
    const favoritesStored = localStorage.getItem(GET_FAVORITES_KEY);
    let stored = [];

    if (!foundElement) return;

    if (favoritesStored !== null) {
        stored = JSON.parse(favoritesStored);
    }

    if (stored.some((item) => item.mal_id === foundElement.mal_id)) {
        alert('El elemento ya está en la lista de favoritos');
        return;
    }

    stored.push(foundElement);
    localStorage.setItem(GET_FAVORITES_KEY, JSON.stringify(stored));
    renderFavorites(stored);
}

function handleDeleteFavorite(index) {
    let storedFavorites = localStorage.getItem(GET_FAVORITES_KEY);

    if (storedFavorites !== null) {
        storedFavorites = JSON.parse(storedFavorites);
        storedFavorites.splice(index, 1);
        localStorage.setItem(
            GET_FAVORITES_KEY,
            JSON.stringify(storedFavorites),
        );
        renderFavorites(storedFavorites);
    }
}

function handleIteration(anime) {
    const listItem = document.createElement('li');
    const image = document.createElement('img');
    const title = document.createElement('p');

    title.textContent = anime.title;
    image.src = anime.images.jpg.large_image_url;
    image.alt = 'Anime Image';
    listItem.style.border = '1px solid #ccc';
    listItem.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.1)';
    listItem.style.padding = '20px';
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';
    listItem.style.justifyContent = 'center';

    if (anime.images.jpg.large_image_url === FAKED_IMAGE_URL) {
        image.src = DEFAULT_IMAGE;
    }

    listItem.appendChild(image);
    listItem.appendChild(title);

    return { listItem, image, title };
}

function renderFavorites(favorites) {
    favoritesContainer.innerHTML = '';

    favorites.forEach((anime, index) => {
        const data = handleIteration(anime);
        const listItem = data.listItem;

        listItem.addEventListener('click', function () {
            handleDeleteFavorite(index);
        });

        favoritesContainer.appendChild(listItem);
    });
}

function renderList(animes) {
    list.innerHTML = '';

    for (const anime of animes) {
        const data = handleIteration(anime);
        list.appendChild(data.listItem);
        data.listItem.addEventListener('click', onHandleFavoriteClick);
    }
}

async function fetchList(query) {
    const url = `https://api.jikan.moe/v4/anime?q=${query}`;
    const response = await fetch(url);
    return await response.json();
}

async function handleSearch() {
    const inputSearch = document.querySelector('#input-search').value;
    if (inputSearch === '') {
        alert('Por favor, ingresa el nombre de una serie Anime.');
        return;
    }

    const response = await fetchList(inputSearch);
    animeList = response.data;
    renderList(response.data);
}

function handleStoredFavorites() {
    const dataCruda = localStorage.getItem(GET_FAVORITES_KEY);
    if (dataCruda !== null) renderFavorites(JSON.parse(dataCruda));
}

function handleDeleteAll() {
    const confirmation = confirm(
        '¿Estás seguro de que quieres borrar todos los datos del almacenamiento local?',
    );

    if (confirmation) {
        localStorage.setItem(GET_FAVORITES_KEY, JSON.stringify([]));
        // para borrar los datos, y mantener la KEY
        favoritesContainer.innerHTML = '';
    }
}

function handleResetList() {
    list.innerHTML = [];
}

handleStoredFavorites();
document.querySelector('#search').addEventListener('click', handleSearch);
document
    .querySelector('#delete-btn')
    .addEventListener('click', handleDeleteAll);

document.querySelector('#reset').addEventListener('click', handleResetList);
