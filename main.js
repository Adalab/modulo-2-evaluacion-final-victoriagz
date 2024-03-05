"use strict";
const inputSearch = document.querySelector("#input-search");
const buttonSearch = document.querySelector("#search");
const list = document.querySelector("#list");

function renderList(elements) {
  list.innerHTML = "";

  const results = document.querySelector("#results");
  const message = document.createElement("p");
  message.innerHTML = "Resultados:";
  results.appendChild(message);

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
    .then((data) => {
      const results = data.data;
      renderList(results);
    });
}

buttonSearch.addEventListener("click", handleSearch);
