import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

import { cardsTowns, simpleTownsCards, updateFav } from "./components/card-town";
import { showAlert, Types } from "./components/alert";
import { getLocalItem } from "./local-storage";

console.log("main.js loaded");

const toastTrigger = document.getElementById("liveToastBtn");
const toastLiveExample = document.getElementById("liveToast");

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
if (toastTrigger) {
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
  });
}

const btnSearch = document.getElementById("button-search");
const inputSearch = document.getElementById("input-search");

const formSearch = document.getElementById("form-search");

formSearch.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!inputSearch.value || inputSearch.value === "") {
    showAlert(Types.WARNING, `Oula, Un ville sans nom n'existe pas !!`);
    return;
  }
  await cardsTowns(inputSearch.value);
});

btnSearch.addEventListener("click", async () => {
  if (!inputSearch.value || inputSearch.value === "") {
    showAlert(Types.WARNING, `Oula, Un ville sans nom n'existe pas !!`);
    return;
  }
  await cardsTowns(inputSearch.value);
});



updateFav();

