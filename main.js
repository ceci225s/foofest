"use strict";
import "./sass/style.scss";
import {
  loadBandJson,
  loadSpots,
  finalizeTickets,
  postToDatabase,
} from "./js/database";
import {
  displayChosenTicket,
  showAvailableCamps,
  qtyChange,
} from "./js/ticket";
import { displayLineup } from "./js/program";

window.addEventListener("DOMContentLoaded", start);

async function start() {
  await loadBandJson();
  document
    .querySelector("#menu_program")
    .addEventListener("click", showProgramSection);
  document
    .querySelector("#menu_ticket")
    .addEventListener("click", showTicketSection);
}

function showProgramSection() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#program").classList.add("active_up");
  document.querySelector("#frontpage").classList.add("active_up");
  displayLineup();
}

function showTicketSection() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#ticket").classList.add("active_up");
  document.querySelector("#frontpage").classList.add("active_up");

  document
    .querySelector(".ticket_buttons")
    .addEventListener("click", (event) => {
      showFormFlow1(event.target.dataset.price, event.target.dataset.type);
      // bookingInfo.ticketType = event.target.dataset.type;
    });
}

function showFormFlow1(price, type) {
  document.querySelector("#ticket").classList.remove("active_up");
  document.querySelector("#ticket").classList.add("active");

  displayChosenTicket(price);
  qtyChange(price, type);
  showAvailableCamps(price, type);
}

// function startCountdown() {
//   document.getElementById("timer").innerHTML = "05" + ":" + "00";

//   let presentTime = document.getElementById("timer").innerHTML;
//   let timeArray = presentTime.split(/[:]+/);
//   let m = timeArray[0];
//   let s = checkSecond(timeArray[1] - 1);
//   if (s == 59) {
//     m = m - 1;
//   }
//   if (m < 0) {
//     return;
//   }

//   document.getElementById("timer").innerHTML = m + ":" + s;
//   // console.log(m);
//   setTimeout(startCountdown, 1000);
// }

// function checkSecond(sec) {
//   if (sec < 10 && sec >= 0) {
//     sec = "0" + sec;
//   } // add zero in front of numbers < 10
//   if (sec < 0) {
//     sec = "59";
//   }
//   return sec;
// }
