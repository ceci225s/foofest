"use strict";
import "./sass/style.scss";

let lineup = [];
let bandJson;

window.addEventListener("DOMContentLoaded", start);

async function start() {
  await loadBandJson();
  await loadScheduleJson();
}

//------------------------ FETCH ALL DATA

//Fetch bands
async function loadBandJson() {
  const bands = await fetch("https://foo-techno-fest.herokuapp.com/bands", {
    method: "GET",
  });
  bandJson = await bands.json();
  console.log(bandJson);
  displayLineup();
}

//Fetch schedule
async function loadScheduleJson() {
  const schedule = await fetch(
    "https://foo-techno-fest.herokuapp.com/schedule",
    {
      method: "GET",
    }
  );
  const scheduleJson = await schedule.json();
  console.log(scheduleJson);
}

//------------------------ APP
//Camping spots
const availableSpots = await fetch(
  "https://foo-techno-fest.herokuapp.com/available-spots",
  {
    method: "GET",
  }
);
const availableSpotsJson = await availableSpots.json();
console.log(availableSpotsJson);

//------------------------ SHOW BANDS
function displayLineup() {
  let temp = document.querySelector("#artist");
  let cont = document.querySelector(".elementcontainer");

  bandJson.forEach((artist) => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector("#artist_name").innerHTML = artist.name;
    // console.log(artist.name);
    clone
      .querySelector(".open_artist")
      .addEventListener("click", () => openPopup(artist));
    cont.appendChild(clone);
  });
}

//------------------------ SORT

//------------------------ FILTER

//------------------------ SHOW SCHEDULE

//------------------------ POP UP

function openPopup(artist) {
  document.querySelector("#lineup").classList.add("active");
  document
    .querySelector("#close_artist")
    .addEventListener("click", closeArtist);
  // const popup = document.querySelector(".info");
  // popup.style.display = "block";

  console.log("se mig");
  document.querySelector("#info .name").textContent = artist.name;
  document.querySelector("#info .members").textContent = artist.name;
  document.querySelector("#info .genre").textContent = artist.genre;
  console.log(artist.genre);
}

function closeArtist() {
  document.querySelector("#lineup").classList.remove("active");
}
