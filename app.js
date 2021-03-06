"use strict";
import "./sass/style.scss";
import { loadBandJson } from "./js/database";

import { displayLineup } from "./js/program";

let scheduleJson;

window.addEventListener("DOMContentLoaded", start);

async function start() {
  await loadScheduleJson();

  document.querySelector("#menu_schedule").addEventListener("click", showScheduleSection);
  document.querySelector("#menu_program").addEventListener("click", showProgramSection);
  let bandJson = await loadBandJson();
  displayLineup(bandJson);
}

//------------------------ FETCH ALL DATA

//Fetch schedule
async function loadScheduleJson() {
  const schedule = await fetch("https://foo-techno-fest.herokuapp.com/schedule", {
    method: "GET",
  });
  scheduleJson = await schedule.json();
  console.log(scheduleJson);

  // show schedule Monday as default
  renderSchedule("mon");
}

document.querySelector(".menu").addEventListener("click", (event) => {
  renderSchedule(event.target.dataset.day);
});

function renderSchedule(day) {
  // reset
  document.querySelector(".jotunheim").innerHTML = "";
  document.querySelector(".vanaheim").innerHTML = "";
  document.querySelector(".midgard").innerHTML = "";

  // forLoop 0-23
  for (let i = 0; i < 24; i += 2) {
    let timeString;
    if (i < 10) {
      timeString = `0${i}:00`;
    } else {
      timeString = `${i}:00`;
    }
    if (scheduleJson.Jotunheim[day].find((s) => s.start == timeString)) {
      document.querySelector(".jotunheim").innerHTML += `<div class="time_slot">
          ${scheduleJson.Jotunheim[day].find((s) => s.start == timeString).act}
        </div>`;
    } else {
      document.querySelector(".jotunheim").innerHTML += '<div class="time_slot"></div>';
    }
    if (scheduleJson.Vanaheim[day].find((s) => s.start == timeString)) {
      document.querySelector(".vanaheim").innerHTML += `<div class="time_slot">
          ${scheduleJson.Vanaheim[day].find((s) => s.start == timeString).act}
        </div>`;
    } else {
      document.querySelector(".vanaheim").innerHTML += '<div class="time_slot"></div>';
    }
    if (scheduleJson.Midgard[day].find((s) => s.start == timeString)) {
      document.querySelector(".midgard").innerHTML += `<div class="time_slot">
          ${scheduleJson.Midgard[day].find((s) => s.start == timeString).act}
        </div>`;
    } else {
      document.querySelector(".midgard").innerHTML += '<div class="time_slot"></div>';
    }
  }
}

function showScheduleSection() {
  console.log("schedule");
  // MOVE TICKET SECTION UP
  document.querySelector("#app_schedule").classList.add("active_up");
  document.querySelector("#app_frontpage").classList.add("active_up");
}

function showProgramSection() {
  console.log("program");
  document.querySelector("#app_program").classList.add("active_up");
  document.querySelector("#app_frontpage").classList.add("active_up");
}
