"use strict";
import "./sass/style.scss";
import { loadBandJson } from "./js/database";
import { showFormFlow1 } from "./js/ticket";
import { displayLineup } from "./js/program";

window.addEventListener("DOMContentLoaded", start);

async function start() {
  let bandJson = await loadBandJson();
  document.querySelector("#contact").addEventListener("click", showContactPage);
  document
    .querySelector("#menu_ticket")
    .addEventListener("click", showTicketSection);
  document
    .querySelector("#menu_program")
    .addEventListener("click", () => showProgramSection(bandJson));
}

function showContactPage() {
  document.querySelector("#frontpage").classList.add("active_right_desktop");
  document.querySelector("#contact_page").classList.add("active_right_desktop");
}

function showProgramSection(bandJson) {
  // MOVE LINEUP SECTION UP
  document.querySelector("#program").classList.add("active_up");
  document.querySelector("#frontpage").classList.add("active_up");
  displayLineup(bandJson);
}

function showTicketSection() {
  // MOVE TICKET SECTION UP
  document.querySelector("#ticket").classList.add("active_up");
  document.querySelector("#frontpage").classList.add("active_up");

  document
    .querySelector(".ticket_buttons")
    .addEventListener("click", (event) => {
      showFormFlow1(event.target.dataset.price, event.target.dataset.type);
      // bookingInfo.ticketType = event.target.dataset.type;
    });
}
