import {
  finalizeOrder,
  loadSpots,
  postToDatabase,
  reserveTickets,
} from "./database";
import Validator from "vanillajs-validation";
import party from "party-js";

let qty = document.querySelector(".v-counter .count");
let time;
let bookingInfo = {
  personalInfo: [],
  id: "",
  ticketType: "",
  campingArea: "",
  ticketQuantity: "",
};

// SHOW PURCHASE
export function displayChosenTicket(price) {
  if (price == "799") {
    document.querySelector(".ticket_type").textContent = "REGULAR";
  } else {
    document.querySelector(".ticket_type").textContent = "VIP";
  }
}
// check for availability - if not enough spots, hide camp
export async function showAvailableCamps(price, type) {
  bookingInfo.ticketType = type;
  bookingInfo.ticketQuantity = qty.value;
  // update summery
  renderSummery(price, type);
  chooseCampArea();

  // get availability from
  const freeCampSpots = await loadSpots();

  // for each camp, if availability is below ticket qty then hide option
  for (let obj of freeCampSpots) {
    document
      .querySelector(`.camp_${obj.area.toLowerCase()}`)
      .classList.remove("hide");
    if (obj.available < qty.value) {
      document
        .querySelector(`.camp_${obj.area.toLowerCase()}`)
        .classList.add("hide");
    }
  }
}

function chooseCampArea() {
  let radios = document.forms["payment_form"].elements["area"];

  for (let i = 0, max = radios.length; i < max; i++) {
    // when area is chosen then enable Next button and call function nextForm
    radios[i].onclick = function () {
      bookingInfo.campingArea = radios[i].value;
      document.querySelector("#show_camp").innerHTML = radios[i].value;
      //   when camp is chosen, enable the button
      document.querySelector("#flow1_next").disabled = false;
      document
        .querySelector("#flow1_next")
        .addEventListener("click", showFormFlow2);
    };
  }
}

// _______________________________ FORM ________________________________//

function renderSummery(price, type) {
  // SHOW HOW MANY TICKETS
  document.querySelector(".quantity").textContent = qty.value;
  // SHOW THE PRICE
  document.querySelector(".ticket_name").textContent = type;
  // SHOW PRICE X QUANTITY
  document.querySelector(".total_price").textContent = qty.value * price + ",-";
  // SHOW TOTAL PRICE INCL FEE
  document.querySelector(".sum").textContent = qty.value * price + 99 + ",-";
}

// quantity input field
// Following code is from : https://codepen.io/vijaywaskrishna/pen/poRmdgB

export function qtyChange(price, type) {
  let plusMinusWidgets = document.querySelectorAll(".v-counter");

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
      .addEventListener("change", () => showAvailableCamps(price, type));
  }
}

// both plus and minus use the same function, but value is set by the class of the button
function clickHandler(event) {
  // reference to the count input field
  let countEl = event.target.parentNode.querySelector(".count");
  if (event.target.className.match(/\bminusBtn\b/)) {
    if (qty.value > 0) {
      countEl.value = Number(countEl.value) - 1;
    }
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

// ___________________________FORM FLOW 2 ___________________________///

async function showFormFlow2() {
  document.querySelector("#ticket_flow1").classList.add("ticket_up");
  document.querySelector("#ticket_flow2").classList.add("active_up");
  showForms();
  document.getElementById("timer").innerHTML = "00" + ":" + "10";
  document.querySelector("#status p").classList.remove("hide");
  startCountdown();
}

function showForms() {
  // show name form x ticket qty
  let cardTemplate = document.querySelector("#cardTemplate");
  let cardContainer = document.querySelector("#cardContainer");
  for (let i = 0; i < bookingInfo.ticketQuantity; i++) {
    console.log(i);
    let klon = cardTemplate.cloneNode(true).content;
    cardContainer.appendChild(klon);
  }

  let form = document.querySelector("[data-form]");
  const formValidation = new Validator(form, {
    rules: {
      name: {
        equalTo: "",
        required: true,
      },
      last_name: {
        equalTo: "",
        required: true,
      },
      email: {
        email: true,
      },
    },
    messages: {
      name: {
        minlength: "Pls enter your name.",
        required: "Input value required!",
      },
      last_name: {
        minlength: "Pls enter your lastname.",
        required: "Input value required!",
      },
      email: {
        valueIs: 'Pls enter your email".',
      },
    },
  });
  getId();
  document
    .querySelector("#ticket_flow2 .button")
    .addEventListener("click", submitNames);
}

async function getId() {
  // send chosen camp name to function reserveTickets to get ID
  bookingInfo.id = await reserveTickets(bookingInfo);
  console.log(bookingInfo.id);
}

function startCountdown() {
  let presentTime = document.getElementById("timer").innerHTML;
  let timeArray = presentTime.split(/[:]+/);
  let m = timeArray[0];
  let s = checkSecond(timeArray[1] - 1);
  if (s == 59) {
    m = m - 1;
  }
  if (m < 0) {
    return;
  }

  document.getElementById("timer").innerHTML = m + ":" + s;
  console.log(m, s);
  time = setTimeout(startCountdown, 1000);
  if (m == "00" && s == "00") {
    let popup = document.querySelector("#popup");
    popup.classList.remove("hide");
  }
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {
    sec = "0" + sec;
  } // add zero in front of numbers < 10
  if (sec < 0) {
    sec = "59";
  }
  return sec;
}

function stopTime() {
  clearTimeout(time);
}

function submitNames(e) {
  const formFields = document.querySelectorAll("#booking_info");
  let nameArr = [];
  formFields.forEach((e) => {
    const names = e.querySelector("#multi-first-name").value;
    const lastname = e.querySelector("#multi-last-name").value;
    const email = e.querySelector("#multi-email").value;

    // push form values to array
    nameArr.push({ names, lastname, email });
    bookingInfo.personalInfo = nameArr;
  });

  console.log(nameArr);

  showFormFlow3();
}

function showFormFlow3() {
  console.log(bookingInfo);
  document.querySelector("#ticket_flow2").classList.add("ticket_up");
  document.querySelector("#ticket_flow3").classList.add("active_up");

  document
    .querySelector("#ticket_flow3 .button")
    .addEventListener("click", showFormFlow4);
}

function showFormFlow4() {
  document.querySelector("#ticket_flow3").classList.add("ticket_up");
  document.querySelector("#ticket_flow4").classList.add("active_up");
  document.querySelector(".summery").classList.add("active_up");
  stopTime();

  renderConfirmation();
  finalizeFlow();
}

async function finalizeFlow() {
  await finalizeOrder(bookingInfo);
  postToDatabase(bookingInfo);
}

function renderConfirmation() {
  let summery = document.querySelector(".summery").innerHTML;

  document.querySelector(".purchase_result").innerHTML = summery;
}
