"use strict";
import "./sass/style.scss";

let lineup = [];
let bandJson;
let scheduleJson;

window.addEventListener("DOMContentLoaded", start);

async function start() {
  await loadBandJson();
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

//------------------------ FRONT PAGE

//------------------------ SHOW BANDS
function displayLineup() {
  let temp = document.querySelector(".artist");
  let cont = document.querySelector(".elementcontainer");

  bandJson.forEach((artist) => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector("#artist_name").innerHTML = artist.name;

    clone
      .querySelector("#artist_name")
      .addEventListener("click", () => openArtist(artist));
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
}

function openTicket() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#ticket_flow1").classList.add("ticket_left");
  document.querySelector(".wrapper").classList.add("active_left");
}

// TICKET QUANTITY
let minus_A = document.querySelector("#product_A_form .btn-subtract");
let add_A = document.querySelector("#product_A_form .btn-add");
let quantity_A = document.querySelector("#product_A_form .item-quantity");

minus_A.addEventListener("click", function () {
  quantity_A.value--;
});

add_A.addEventListener("click", function () {
  quantity_A.value++;
});
