"use strict";
import "./sass/style.scss";

let lineup = [];
let bandJson;
let availableSpotsJson;
let qty = document.querySelector(".v-counter .count");

window.addEventListener("DOMContentLoaded", start);

async function start() {
  await loadBandJson();
  await loadSpots();

  // VIS LINEUP START

  document.querySelector("#menu_program").addEventListener("click", showLineup);

  document.querySelector("#menu_ticket").addEventListener("click", showTicket);
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
async function loadSpots() {
  let availableSpots = await fetch(
    "https://foo-techno-fest.herokuapp.com/available-spots",
    {
      method: "GET",
    }
  );
  availableSpotsJson = await availableSpots.json();
  console.log(availableSpotsJson);
}
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

function showLineup() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#program").classList.add("active_up");
}

function showTicket() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#ticket").classList.add("active_up");

  document
    .querySelector(".ticket_buttons")
    .addEventListener("click", (event) => {
      openForm(event.target.dataset.price);
    });
}

// _______________________________ FORM ________________________________//

// SHOW PURCHASE
function openForm(price) {
  document.querySelector("#ticket_flow1").classList.add("ticket_left");
  document.querySelector(".wrapper").classList.add("active_left");
  document.querySelector("#ticket").classList.add("active");

  if (price == "799") {
    document.querySelector(".ticket_type").textContent = "REGULAR ticket";
  } else {
    document.querySelector(".ticket_type").textContent = "VIP ticket";
  }
  renderSummery(price);
  // renderQty();
  showAvalibility();
}

function renderSummery(price) {
  let qty = document.querySelector(".v-counter .count");

  // SHOW HOW MANY TICKETS
  document.querySelector(".quantity").textContent = qty.value;
  // SHOW THE PRICE
  document.querySelector(".price").textContent = price + ",-";
  // SHOW PRICE X QUANTITY
  document.querySelector(".price_add_up").textContent =
    qty.value * price + ",-";
  // SHOW TOTAL PRICE INCL FEE
  document.querySelector(".total_price").textContent =
    qty.value * price + 99 + ",-";
}

// show availability for each camp site
// function showAvalibility() {
//   for (let obj of availableSpotsJson) {
//     if (obj.area === "Svartheim") {
//       document.querySelector(".camp_svartheim span").textContent =
//         obj.available;
//     } else if (obj.area === "Nilfheim") {
//       document.querySelector(".camp_nilfheim span").textContent = obj.available;
//     } else if (obj.area === "Muspelheim") {
//       document.querySelector(".camp_muspelheim span").textContent =
//         obj.available;
//     } else if (obj.area === "Alfheim") {
//       document.querySelector(".camp_alfheim span").textContent = obj.available;
//     } else if (obj.area === "Helheim") {
//       document.querySelector(".camp_helheim span").textContent = obj.available;
//     }
//   }
// }

// check for availability - if not enough spots, hide camp
function showAvalibility() {
  // update summery qty field
  document.querySelector(".quantity").textContent = qty.value;
  // for each camp, if availability is below ticket qty then hide option
  for (let obj of availableSpotsJson) {
    if (obj.available < qty.value) {
      document
        .querySelector(`.camp_${obj.area.toLowerCase()}`)
        .classList.add("hide");
    }
  }
}
// when camp site is chosen, check if there is enough spots compared to ticket qty
let radios = document.querySelectorAll(".areas input");

// for (let i = 0, max = radios.length; i < max; i++) {
//   radios[i].onclick = function () {
//     if (qty > this.value) {
//       alert("not enough available camp spots. Please choose another area");
//     }
//   };
// }

// quantity input field
// _________________ Following code is from : https://codepen.io/vijaywaskrishna/pen/poRmdgB

let resultEl = document.querySelector(".quantity"),
  plusMinusWidgets = document.querySelectorAll(".v-counter");

// Attach the handlers to each plus-minus thing
for (let i = 0; i < plusMinusWidgets.length; i++) {
  plusMinusWidgets[i]
    .querySelector(".minusBtn")
    .addEventListener("click", clickHandler);
  plusMinusWidgets[i]
    .querySelector(".plusBtn")
    .addEventListener("click", clickHandler);
  plusMinusWidgets[i]
    .querySelector(".count")
    .addEventListener("change", showAvalibility);
}

// both plus and minus use the same function, but value is set by the class of the button
function clickHandler(event) {
  // reference to the count input field
  let countEl = event.target.parentNode.querySelector(".count");
  if (event.target.className.match(/\bminusBtn\b/)) {
    countEl.value = Number(countEl.value) - 1;
  } else if (event.target.className.match(/\bplusBtn\b/)) {
    countEl.value = Number(countEl.value) + 1;
  }
  // When we programmatically change the value, we need to manually trigger
  //  the change event.
  triggerEvent(countEl, "change");
}

// triggerEvent() -- function to trigger an HTMLEvent on a given element. similar to jquery's trigger(), simply a convenience function. Not the point of this exercise.
function triggerEvent(el, type) {
  if ("createEvent" in document) {
    // modern browsers, IE9+
    let e = document.createEvent("HTMLEvents");
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  } else {
    // IE 8
    var e = document.createEventObject();
    e.eventType = type;
    el.fireEvent("on" + e.eventType, e);
  }
}
