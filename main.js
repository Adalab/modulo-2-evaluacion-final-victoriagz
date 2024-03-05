"use strict";
const inputSearch = document.querySelector("#input-search");
const buttonSearch = document.querySelector("#search");
const list = document.querySelector("#list");
const favoritesContainer = document.querySelector("#favorite-list");

let favoritesList = [];
let seriesList = [];

function handleFavorite(event) {
  const serieSelected = seriesList.find((element) => {
    return event.currentTarget.id === element.id;
  });
  console.log(favoritesList);
  const indexSerieFavorited = favoritesList.findIndex((favoriteItem) => {
    return favoriteItem.id === event.currentTarget.id;
  });
  if (indexSerieFavorited === -1) {
    favoritesList.push(serieSelected);
  }
  renderList(favoritesList, favoritesContainer);
}

function renderList(elements) {
  list.innerHTML = "";

  for (const element of elements) {
    const listItem = document.createElement("li");
    const image = document.createElement("img");
    const title = document.createElement("p");

    title.textContent = element.title;
    image.src = element.images.jpg.large_image_url;
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
