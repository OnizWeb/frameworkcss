import * as bootstrap from "bootstrap";

import { getIcon, getIconWeather } from "./services/svg.service";

console.log("weather.js loaded");

/**
 * TODO:
 * - Interface Weather
 * - Mapping Weather
 */

/**
 * @typedef {Object} Town
 * @property {string} uuid - unique identification
 * @property {string} name - Ville
 * @property {string} country - Pays
 * @property {string} state - Etat / Région
 * @property {Coordinate} coordinate - Coordonnées GPS
 */

/**
 * @typedef {Object} Weather
 * @property {string} uuid - unique identification
 * @property {string} name - Ville
 * @property {string} country - Pays
 * @property {string} state - Etat / Région
 * @property {Coordinate} coordinate - Coordonnées GPS
 */

/**
 * @typedef {Object} Coordinate
 * @property {number} long - Longitude
 * @property {number} lat - Latitude
 */

/**
 * Enum for common wind direction
 * @readonly
 * @enum { string }
 */
export const WindDirection = Object.freeze({
  N: "Nord",
  NNE: "Nord / Nord-Est",
  NE: "Nord-Est",
  ENE: "Est / Nord-Est",
  E: "Est",
  ESE: "Est / Sud-Est",
  SE: "Sud-Est",
  SSE: "Sud / Sud-Est",
  S: "Sud",
  SSW: "Sud / Sud-Ouest",
  SW: "Sud-Ouest",
  WSW: "Ouest / Sud-Ouest",
  W: "Ouest",
  WNW: "Ouest / Nord-Ouest",
  NW: "Nord-Ouest",
  NNW: "Nord / Nord-Ouest",
  N: "Nord",
});

/**
 * @typedef {Object} Weather
 * @property {number} notedAt - Date du dernier relevé
 * @property {string} main - temps actuel
 * @property {string} description - description du temps actuel
 * @property {number} temp - Température actuel - °C
 * @property {number} feels_like - Température ressenti - °C
 * @property {number} pressure - Pression atmosphérique - hPa
 * @property {number} humidity - Humidité - %
 * @property {number} temp_max - Température maximun - °C
 * @property {number} temp_min - Température minimum - °C
 * @property {number} wind_speed - Vitesse du vent - m/s
 * @property {number} wind_gust - Vitesse des rafales de vent - m/s
 * @property {WindDirection} wind_deg - Direction du vent - m/s
 * @property {number} snow - précipitation neige - mm/h
 * @property {number} rain - précipitation pluie - mm/h
 * @property {number} sunrise - Levé du soleil
 * @property {number} sunset - Couché du soleil
 */

/**
 *
 * @param {string} search
 * @return {Array} Array of Towns by openweathermap
 */
export async function searchTowns(search) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=720b6f8bc9d2409d49f440298f0a2910`
    );

    const towns = await response.json();

    if (!towns) {
      throw new Error("ERR_SEARCH_TOWNS");
    }

    return towns;
  } catch (error) {
    throw new Error("ERR_SEARCH_TOWNS");
  }
}

/**
 * @param {number} lat - Latitude
 * @param {number} long - Longitude
 * @return {Weather} Temps de la ville
 */
export async function getWeather(lat, long) {
  try {
    const request = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&lang=fr&appid=720b6f8bc9d2409d49f440298f0a2910`
    );

    const response = await request.json();

    console.log("weather response", response);

    if (!response) {
      throw new Error("ERR_GET_WEATHER");
    }

    const mapped = mappedWeather(response);

    console.log("météo", mapped);

    return mapped;
  } catch (error) {
    throw new Error("ERR_GET_WEATHER");
  }
}

/**
 * @param {Object} weather - Ville
 * @return {Weather} Temps de la ville
 */
function mappedWeather(weatherResponse) {
  const windDeg = _windDirection(weatherResponse.wind?.deg);
  const weather = {
    notedAt: weatherResponse.dt,
    main: weatherResponse.weather?.[0].main,
    description: weatherResponse.weather?.[0].description,
    temp: weatherResponse.main?.temp,
    feels_like: weatherResponse.main?.feels_like,
    pressure: weatherResponse.main?.pressure,
    humidity: weatherResponse.main?.humidity,
    temp_max: weatherResponse.main?.temp_max,
    temp_min: weatherResponse.main?.temp_min,
    wind_speed: weatherResponse.wind?.speed,
    wind_gust: weatherResponse.wind?.gust,
    wind_deg: WindDirection[windDeg],
    snow: weatherResponse.snow?.["1h"],
    rain: weatherResponse.rain?.["1h"],
    sunrise: weatherResponse.sys?.sunrise,
    sunset: weatherResponse.sys?.sunset,
    clouds: weatherResponse.clouds?.all,
  };

  return weather;
}

/**
 * @param {Town} town - Informations de la ville
 * @param {Weather} weather - Temps de la ville
 * @return {void} Ouvre la modal avec toutes les inforamtions concernant la météo
 */
export async function getDetailTownAndWeather(town, weather) {
  const modal = document.querySelector("#modal-weather-detail");

  console.log(town.name, weather)

  modal.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-dialog-scrollables">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title d-flex flex-row gap-2 align-items-center"><span>${
              town.name
            }</span><div>${await _getIconWeather(
    weather.clouds,
    weather.rain,
    weather.snow
  )}</div></h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
          <div class="d-flex flex-row gap-2 flex-wrap">
            <p class="badge rounded-pill text-bg-dark d-flex flex-row gap-2 align-items-center">
              ${await getIcon("temp")}
              <span>${weather.temp}°C (min: ${weather.temp_min}°C - max: ${
    weather.temp_max
  }°C)</span>
            </p>
            <p class="badge rounded-pill text-bg-dark d-flex flex-row gap-2  align-items-center">
              ${await getIcon("pressure")}
              <span>${weather.pressure} hPa</span>
            </p>
            <p class="badge rounded-pill text-bg-dark d-flex flex-row gap-2  align-items-center">
              ${await getIcon("wind")}
              <span>${weather.wind_speed ?? '--'} m/s - ${weather.wind_deg ?? '--'}</span>
            </p>
            <p class="badge rounded-pill text-bg-dark d-flex flex-row gap-2  align-items-center">
              ${await getIcon("humidity")}
              <span>${weather.humidity}%</span>
            </p>
          </div>
          <div>
            <p>${weather.description}</p>
          </div>

          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>`;

  const myModal = new bootstrap.Modal("#modal-weather-detail", {
    backdrop: true,
  });

  myModal.show();
}

/**
 * @param {number} deg - Direction du vent en degré
 * @return {WindDirection} Direction du vent
 */
function _windDirection(deg) {
  const result = Math.round(deg / 22.5) + 1;
  const windFind = Object.keys(WindDirection).find((wind, index) => {
    if (index === result - 1) {
      return wind;
    }
  });

  return windFind;
}

/**
 * @param {number} deg - Direction du vent en degré
 * @return {WindDirection} Direction du vent
 */
async function _getIconWeather(clouds, rain, snow) {
  switch (true) {
    case clouds >= 0 && clouds < 20:
      if (!rain && !snow) {
        return await getIconWeather("sunny");
      }
      if (rain) {
        return await getIconWeather("rain");
      }

      if (snow) {
        return await getIconWeather("snow");
      }
      break;

    case clouds >= 20  && clouds < 40:
      if (!rain && !snow) {
        return await getIconWeather("partial_cloud");
      }
      if (rain) {
        return await getIconWeather("rain");
      }

      if (snow) {
        return await getIconWeather("snow");
      }
      break;
    case clouds >= 40  && clouds < 60:
      if (!rain && !snow) {
        return await getIconWeather("cloud");
      }
      if (rain) {
        return await getIconWeather("rain");
      }

      if (snow) {
        return await getIconWeather("snow");
      }
      break;
    case clouds >= 60:
      if (!rain && !snow) {
        return await getIconWeather("double_cloud");
      }
      if (rain) {
        return await getIconWeather("rain");
      }

      if (snow) {
        return await getIconWeather("snow");
      }
      break;

    default:
      break;
  }
}
