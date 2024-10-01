import * as Leaflet from "leaflet";

import { showAlert, Types } from "./alert";
import { searchTowns } from "../weather";
import { getLocalItem, setToLocalItem } from "../local-storage";
import { getWeather, getDetailTownAndWeather } from "../weather";

/**
 *
 * @param {Town} favs champ de recherche
 * @return {void}
 */
export async function simpleTownsCards(favs) {
  const favContainer = document.querySelector(".fav-container");

  if (!favs || favs.length === 0) {
    favContainer.textContent = "Aucun Favoris";
    return;
  }

  while (favContainer.firstChild) {
    favContainer.removeChild(favContainer.firstChild);
  }
  let delay = 0;

  for (const item of favs) {
    const weatherTown = await getWeather(
      item.coordinate.lat,
      item.coordinate.long
    );
    const notedAt = new Date(weatherTown.notedAt * 1000);
    console.log("date", notedAt);
    const divCard = document.createElement("div");
    divCard.classList = "card fade-in";
    divCard.style.width = "18rem";
    divCard.style.animationDelay = `${delay}ms`;
    delay = delay + 500;

    const itemToHTML = `
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">
                <span>Dernier relevé le ${
                  notedAt.getDate() > 9
                    ? notedAt.getDate()
                    : "0" + notedAt.getDate()
                }/${
      notedAt.getMonth() > 9 ? notedAt.getMonth() : "0" + notedAt.getMonth()
    }/${notedAt.getFullYear()} à ${notedAt.getHours()}h${notedAt.getMinutes()}</span>
              </p>
              <p class="card-text">
                <span>${item.state ?? "Non renseigné"} - ${item.country}</span>
              </p>
              <p class="card-text">
                <span>${weatherTown.temp}°C</span> - <span>${
      weatherTown.description
    }</span>
              </p>
              <button id="detail-${
                item.uuid
              }" class="btn btn-info">Voir la météo</button>
              <button class="btn btn-outline-danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg></button>
            </div>
        `;

    divCard.innerHTML = itemToHTML;
    favContainer.append(divCard);

    const buttonActionDetail = document.getElementById(`detail-${item.uuid}`);
    buttonActionDetail.addEventListener("click", () => {
      getDetailTownAndWeather(item, weatherTown);
    });
  }
}

/**
 *
 * @param {string} search champ de recherche
 * @return {void}
 */
export async function cardsTowns(search) {
  const towns = await searchTowns(search);

  if (!towns || towns.length === 0) {
    showAlert(Types.DANGER, `Ooups, ${search} n'est pas une ville !`);
    return;
  }

  const resultContainer = document.querySelector(".result-container");

  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }
  let delay = 0;

  for (const item of towns) {
    const divCard = document.createElement("div");
    divCard.classList = "card fade-in";
    divCard.style.width = "18rem";
    divCard.style.animationDelay = `${delay}ms`;
    delay = delay + 500;

    const uuid = crypto.randomUUID();

    const itemToHTML = `
            <div id="map-${uuid}" class="card-img-top" style="height: 180px"></div>
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">
                <span>${item.state ?? "Non renseigné"} - ${item.country}</span>
              </p>
              <button id="${uuid}" class="btn btn-outline-danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
</svg></button>
            </div>
        `;

    divCard.innerHTML = itemToHTML;
    resultContainer.append(divCard);
    const map = Leaflet.map(`map-${uuid}`, {
      zoomControl: false,
      boxZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
    }).setView([item.lat, item.lon], 8);
    Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    Leaflet.marker([item.lat, item.lon]).addTo(map);

    saveTownListner(uuid, item);
  }
}

/**
 *
 * @param {string} uuid identifiant
 * @param {any} town Ville
 */
function saveTownListner(uuid, item) {
  let town = {
    uuid,
    name: item.name,
    coordinate: {
      long: item.lon,
      lat: item.lat,
    },
    country: item.country,
    state: item.state,
  };

  const buttonSave = document.getElementById(uuid);

  buttonSave.addEventListener("click", () => {
    const items = getLocalItem("list-save");
    console.log("items exist", items);

    if (!items) {
      setToLocalItem("list-save", [town]);
      updateFav();
      showAlert(
        Types.SUCCESS,
        `Super, ${item.name} a été ajouté à votre liste`
      );
      return;
    }

    const newItems = [...items, town];
    setToLocalItem("list-save", newItems);
    updateFav();
    showAlert(Types.SUCCESS, `Super, ${item.name} a été ajouté à votre liste`);
  });
}

export function updateFav() {
  const itemLocal = getLocalItem("list-save");

  simpleTownsCards(itemLocal);
}
