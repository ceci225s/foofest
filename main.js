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
  let temp = document.querySelector(".artist");
  let cont = document.querySelector(".elementcontainer");

  bandJson.forEach((artist) => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector("#artist_name").innerHTML = artist.name;

    clone
      .querySelector(".open_artist")
      .addEventListener("click", () => openArtist(artist));
    cont.appendChild(clone);

    cont.appendChild(clone);
  });
}

//------------------------ SHOW SINGLE ARTIST

function openArtist(artist) {
  // document.querySelector("#lineup").classList.remove("active_up");

  // MOVE LINEUP SECTION TO THE RIGHT
  // document.querySelector(".total_lineup").classList.add("active_right");

  // SHOW ARTIST INFO
  document.querySelector("#info .name").textContent = artist.name;
  document.querySelector("#info .members").textContent = artist.members;
  document.querySelector("#info .genre").textContent = artist.genre;
  document.querySelector("#info img").src = artist.logo;
  document.querySelector("#info .bio").textContent = artist.bio;
}

// VIS LINEUP START

document.querySelector("#lineup_menu").addEventListener("click", openLineup);

function openLineup() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#the_lineup_page").classList.add("active_up");
}

// VIS SCHEDULE START
document
  .querySelector("#schedule_menu")
  .addEventListener("click", openSchedule);

function openSchedule() {
  // MOVE SCHEDULE SECTION UP
  document.querySelector("#the_lineup_page").classList.add("active_up1");
}

// BACK TO MAIN MENU
document
  .querySelector(".elementcontainer button")
  .addEventListener("click", showMainMenu);

function showMainMenu() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#the_lineup_page").classList.remove("active_up");
}

// VIS LINEUP START

document.querySelector("#program").addEventListener("click", expandSchedule);

function expandSchedule() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#program").classList.add("expand");
}
