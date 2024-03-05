"use strict";
const inputSearch = document.querySelector("#input-search");
const buttonSearch = document.querySelector("#search");
const list = document.querySelector("#list");
const favoritesContainer = document.querySelector("#favorite-list");

let favoritesList = [];
let seriesList = [];

function handleFavorite(event) {
  const clickedElement = event.target.parentElement;
  const elementIndex = Array.from(list.children).indexOf(clickedElement);
  const selectedElement = seriesList[elementIndex];

  // Comprobar si el elemento ya está en la lista de favoritos
  if (favoritesList.some((item) => item.mal_id === selectedElement.mal_id)) {
    console.log("El elemento ya está en la lista de favoritos");
    return;
  }

  // Añadir el elemento a la lista de favoritos
  favoritesList.push(selectedElement);

  // Renderizar la lista de favoritos
  renderFavorites();
}
function renderFavorites() {
  favoritesContainer.innerHTML = "";

  for (const element of favoritesList) {
    const listItem = document.createElement("li");
    const image = document.createElement("img");
    const title = document.createElement("p");

    title.textContent = element.title;
    image.src = element.images.jpg.small_image_url;
    image.alt = "Anime Image";

    listItem.appendChild(image);
    listItem.appendChild(title);
    favoritesContainer.appendChild(listItem);
  }
}

function renderList(elements) {
  list.innerHTML = "";

  for (const element of elements) {
    const listItem = document.createElement("li");
    const image = document.createElement("img");
    const title = document.createElement("p");

    title.textContent = element.title;
    image.src = element.images.jpg.image_url;
    image.alt = "Anime Image";

    listItem.appendChild(image);
    listItem.appendChild(title);
    list.appendChild(listItem);
    listItem.addEventListener("click", handleFavorite);
  }
}

function handleSearch() {
  const inputValue = inputSearch.value;
  console.log(inputValue);
  if (inputValue === "") {
    list.innerHTML = "Por favor, ingresa el nombre de una serie Anime. ";
    return;
  }

  const url = `https://api.jikan.moe/v4/anime?q=${inputValue}`;
  fetch(url)
    .then((response) => response.json())
    .then((dataResult) => {
      seriesList = dataResult.data;
      renderList(seriesList, list);
      localStorage.setItem("results", JSON.stringify(seriesList));
    });

  const dataSeriesLocalStorage = JSON.parse(localStorage.getItem("results"));
  if (dataSeriesLocalStorage !== null) {
    seriesList = dataSeriesLocalStorage;
    renderList(dataSeriesLocalStorage, list);
  }
}

buttonSearch.addEventListener("click", handleSearch);
