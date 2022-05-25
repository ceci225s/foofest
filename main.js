"use strict";
import "./sass/style.scss";

let lineup = [];
let bandJson;
let scheduleJson;

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
  const schedule = await fetch("https://foo-techno-fest.herokuapp.com/schedule", {
    method: "GET",
  });
  scheduleJson = await schedule.json();
  console.log(scheduleJson);
  renderSchedule("mon");
}

//------------------------ APP
//Camping spots
const availableSpots = await fetch("https://foo-techno-fest.herokuapp.com/available-spots", {
  method: "GET",
});
const availableSpotsJson = await availableSpots.json();
console.log(availableSpotsJson);

//------------------------ FRONT PAGE

//------------------------ SHOW BANDS
function displayLineup() {
  let temp = document.querySelector(".artist");
  let cont = document.querySelector(".elementcontainer");

  bandJson.forEach((artist) => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector("#artist_name").innerHTML = artist.name;

    clone.querySelector("#artist_name").addEventListener("click", () => openArtist(artist));
    cont.appendChild(clone);

    cont.appendChild(clone);
  });
}

//------------------------ SHOW SINGLE ARTIST

function openArtist(artist) {
  // document.querySelector("#lineup").classList.remove("active_up");

  // MOVE LINEUP SECTION TO THE RIGHT
  document.querySelector(".wrapper").classList.add("active_left");
  document.querySelector("#program").classList.add("active");
  console.log("hej");
  // SHOW ARTIST INFO
  document.querySelector("#info .name").textContent = artist.name;
  document.querySelector("#info .members").textContent = artist.members;
  document.querySelector("#info .genre").textContent = artist.genre;
  document.querySelector("#info img").src = artist.logo;
  document.querySelector("#info .bio").textContent = artist.bio;
}

// VIS LINEUP START

document.querySelector("#menu_program").addEventListener("click", showLineup);

document.querySelector("#menu_ticket").addEventListener("click", openTicket);

function showLineup() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#program").classList.add("active_up");
  document.querySelector(".wrapper").classList.add("active_up");
}

function openTicket() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#ticket").classList.add("active_up");
  document.querySelector(".wrapper").classList.add("active_up");
}

// BACK TO MAIN MENU

// document
//   .querySelector(".elementcontainer button")
//   .addEventListener("click", showMainMenu);

// function showMainMenu() {
//   // MOVE LINEUP SECTION UP
//   document.querySelector("#the_lineup_page").classList.remove("active_up");
// }

function renderSchedule(day) {
  for (i = 0; i < 24; i++) {
    let timeString = "";
    if (i < 10) {
      timeString = `0${i}:00`;
    } else {
      timeString = `${i}:00`;
    }
    if (scheduleJson.Jotunheim[day].find((s) => s.start == timeString)) {
      document.querySelector(".jotunheim").innerHTML = scheduleJson.Jotunheim[day].find(
        (s) => s.start == timeString
      ).act;
    }
  }
}
