"use strict";
import "./sass/style.scss";
import { loadBandJson } from "./js/database";
import {
  displayChosenTicket,
  showAvailableCamps,
  qtyChange,
} from "./js/ticket";
import { displayLineup } from "./js/program";

window.addEventListener("DOMContentLoaded", start);

async function start() {
  let bandJson = await loadBandJson();
  document
    .querySelector("#menu_ticket")
    .addEventListener("click", showTicketSection);
  document
    .querySelector("#menu_program")
    .addEventListener("click", () => showProgramSection(bandJson));
}

function showProgramSection(bandJson) {
  // MOVE LINEUP SECTION UP
  document.querySelector("#program").classList.add("active_up");
  document.querySelector("#frontpage").classList.add("active_up");
  displayLineup(bandJson);
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
