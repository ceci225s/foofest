"use strict";
import "./sass/style.scss";

let bookingInfo = {
  personalInfo: [],
  id: "",
  ticketType: "",
  campingArea: "",
};
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
//------------------------ TICKET RESERVATION

function reserveTickets(campName) {
  const payload = {
    area: campName,
    amount: qty.value,
  };

  fetch("https://foo-techno-fest.herokuapp.com/reserve-spot", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      bookingInfo.id = data.id;
      console.log(data.id);
    })
    .catch((err) => console.error(err));
}

//------------------------ TICKET RESERVATION final

function finalizeTickets() {
  let reservationId = {
    id: bookingInfo.id,
  };
  console.log(data.id);

  fetch("https://foo-techno-fest.herokuapp.com/fullfill-reservation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservationId),
  })
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

//------------------------ save to database
function postToDatabase(form_value) {
  const url = "https://frontend-0eac.restdb.io/rest/foofest-booking";
  const apiKey = "6245615567937c128d7c9395";

  let customerInfo = {
    name: form_value.name,
    lastname: form_value.last_name,
    email: form_value.email,
  };
  POST(customerInfo, url, apiKey);

  async function POST(customerInfo, url, apiKey) {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerInfo),
    })
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }
}
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
  document.querySelector("#program").classList.add("active_program");
  console.log("hej");
  // SHOW ARTIST INFO
  document.querySelector("#info .name").textContent = artist.name;
  document.querySelector("#info .members").textContent = artist.members;
  document.querySelector("#info .genre").textContent = artist.genre;
  document.querySelector("#info .bio").textContent = artist.bio;
  if (artist.logo.startsWith("http")) {
    document.querySelector("#info img").src = artist.logo;
  } else {
    document.querySelector(
      "#info img"
    ).src = `https://foo-techno-fest.herokuapp.com/logos/${artist.logo}`;
  }
  document.querySelector("figcaption").textContent = artist.logoCredits;
}

function showLineup() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#program").classList.add("active_up");
  document.querySelector("#frontpage").classList.add("active_up");
}

function showTicket() {
  // MOVE LINEUP SECTION UP
  document.querySelector("#ticket").classList.add("active_up");
  document.querySelector("#frontpage").classList.add("active_up");

  document
    .querySelector(".ticket_buttons")
    .addEventListener("click", (event) => {
      openForm(event.target.dataset.price);
      bookingInfo.ticketType = event.target.dataset.type;
    });
}

// _______________________________ FORM ________________________________//

// SHOW PURCHASE
function openForm(price) {
  // document.querySelector("#ticket_flow1").classList.add("ticket_left");
  // document.querySelector(".wrapper").classList.add("active_left");
  document.querySelector("#ticket").classList.remove("active_up");
  document.querySelector("#ticket").classList.add("active_ticket");

  if (price == "799") {
    document.querySelector(".ticket_type").textContent = "REGULAR ticket";
  } else {
    document.querySelector(".ticket_type").textContent = "VIP ticket";
  }
  qtyChange(price);
  showAvalibility(price);
}

function renderSummery(price) {
  // SHOW HOW MANY TICKETS
  document.querySelector(".quantity").textContent = qty.value;
  // SHOW THE PRICE
  document.querySelector(".price").textContent = price + ",-";
  // SHOW PRICE X QUANTITY
  document.querySelector(".total_price").textContent = qty.value * price + ",-";
  // SHOW TOTAL PRICE INCL FEE
  document.querySelector(".sum").textContent = qty.value * price + 99 + ",-";
}

// check for availability - if not enough spots, hide camp
function showAvalibility(price) {
  // update summery
  renderSummery(price);

  // for each camp, if availability is below ticket qty then hide option
  for (let obj of availableSpotsJson) {
    if (obj.available < qty.value) {
      document
        .querySelector(`.camp_${obj.area.toLowerCase()}`)
        .classList.add("hide");
    }
  }
  let radios = document.forms["payment_form"].elements["area"];
  let campName;
  for (let i = 0, max = radios.length; i < max; i++) {
    // when area is chosen then enable Next button and call function nextForm
    radios[i].onclick = function () {
      campName = radios[i].value;
      document.querySelector("#flow1_next").disabled = false;
      document
        .querySelector("#flow1_next")
        .addEventListener("click", () => showPersonalInfoSection(campName));

      bookingInfo.campingArea = campName;
      console.log(bookingInfo.campingArea);
    };
  }
}
// quantity input field
// _________________ Following code is from : https://codepen.io/vijaywaskrishna/pen/poRmdgB

function qtyChange(price) {
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
      .addEventListener("change", () => showAvalibility(price));
  }
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

function showPersonalInfoSection(campName) {
  // send chosen camp name to function reserveTickets to get ID
  reserveTickets(campName);
  // startCountdown();
  document.querySelector("#ticket_flow1").classList.add("ticket_up");
  document.querySelector("#ticket_flow2").classList.add("active_up");

  let cardTemplate = document.querySelector("#cardTemplate");
  let cardContainer = document.querySelector("#cardContainer");

  let ticketqty = qty.value;
  // show name form x ticket qty
  for (let i = 0; i < ticketqty; i++) {
    console.log(i);
    let klon = cardTemplate.cloneNode(true).content;
    cardContainer.appendChild(klon);
  }

  const form = document.querySelector("#ticket_flow2 button");
  form.addEventListener("click", handleSubmit);
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
function handleSubmit(e) {
  const formFields = document.querySelectorAll("#booking_info");
  let nameArr = [];
  formFields.forEach((e) => {
    const names = e.querySelector("#name").value;
    const lastname = e.querySelector("#last_name").value;
    const email = e.querySelector("#email").value;

    nameArr.push({ names, lastname, email });
    bookingInfo.personalInfo = nameArr;
  });

  console.log(nameArr);

  lastForm();
}

function lastForm() {
  console.log("hej");
  console.log(bookingInfo);
  document.querySelector("#ticket_flow2").classList.add("ticket_up");

  // document
  //   .querySelector("#ticket_flow3")
  //   .scrollIntoView({ behavior: "smooth" });
  document.querySelector("#ticket_flow3").classList.add("ticket_up");
}

// ---------------------------------payment flow-------------------------
const paymentForm = document.querySelector(".form");
const name = document.getElementById("name");
const number = document.getElementById("number");
const date = document.getElementById("date");
const cvv = document.getElementById("cvv");

/*  SHOW ERROR  */
function showError(element, error) {
  if (error === true) {
    element.style.opacity = "1";
  } else {
    element.style.opacity = "0";
  }
}

/*  CHANGE THE FORMAT NAME  */
name.addEventListener("input", function () {
  let alert1 = document.getElementById("alert-1");
  let error = this.value === "";
  showError(alert1, error);
});

/*  CHANGE THE FORMAT CARD NUMBER*/
number.addEventListener("input", function (e) {
  this.value = numberAutoFormat();

  //show error when is different of 16 numbers and 3 white space
  let error = this.value.length !== 19;
  let alert2 = document.getElementById("alert-2");
  showError(alert2, error);
});

function numberAutoFormat() {
  let valueNumber = number.value;
  // if white space change to ''. If is not a number between 0-9 change to ''
  let v = valueNumber.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

  // the value got min of 4 digits and max of 16
  let matches = v.match(/\d{4,16}/g);
  let match = (matches && matches[0]) || "";
  let parts = [];

  for (let i = 0; i < match.length; i += 4) {
    // after 4 digits add a new element to the Array
    // e.g. "4510023" -> [4510, 023]
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    // add a white space after 4 digits
    return parts.join(" ");
  } else {
    return valueNumber;
  }
}

/*  CHANGE THE FORMAT DATE  */
date.addEventListener("input", function (e) {
  this.value = dateAutoFormat();

  // show error if is not a valid date
  let alert3 = document.getElementById("alert-3");
  showError(alert3, isNotDate(this));

  let dateNumber = date.value.match(/\d{2,4}/g);
});

function isNotDate(element) {
  let actualDate = new Date();
  let month = actualDate.getMonth() + 1; // start january 0 we need to add + 1
  let year = Number(actualDate.getFullYear().toString().substr(-2)); // 2022 -> 22
  let dateNumber = element.value.match(/\d{2,4}/g);
  let monthNumber = Number(dateNumber[0]);
  let yearNumber = Number(dateNumber[1]);

  if (
    element.value === "" ||
    monthNumber < 1 ||
    monthNumber > 12 ||
    yearNumber < year ||
    (monthNumber <= month && yearNumber === year)
  ) {
    return true;
  } else {
    return false;
  }
}

function dateAutoFormat() {
  let dateValue = date.value;
  // if white space -> change to ''. If is not a number between 0-9 -> change to ''
  let v = dateValue.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

  // min of 2 digits and max of 4
  let matches = v.match(/\d{2,4}/g);
  let match = (matches && matches[0]) || "";
  let parts = [];

  for (let i = 0; i < match.length; i += 2) {
    // after 4 digits add a new element to the Array
    // e.g. "4510023" -> [4510, 023]
    parts.push(match.substring(i, i + 2));
  }

  if (parts.length) {
    // add a white space after 4 digits
    return parts.join("/");
  } else {
    return dateValue;
  }
}

/*  CHANGE THE FORMAT CVV  */
cvv.addEventListener("input", function (e) {
  let alert4 = document.getElementById("alert-4");
  let error = this.value.length < 3;
  showError(alert4, error);
});

/* CHECK IF KEY PRESSED IS A NUMBER (input of card number, date and cvv) */
function isNumeric(event) {
  if ((event.keyCode < 48 || event.keyCode > 57) && event.keyCode > 31) {
    return false;
  }
}

/*  VALIDATION FORM WHEN PRESS THE BUTTON   */
paymentForm.addEventListener("submit", function (e) {
  // 1. if there is not any name
  // 2. if the length of the number card is not valid (16 numbers and 3 white space)
  // 3. if is not a valid date (4 number and "/" or is not a valid date)
  // 4. if is not a valid cvv

  if (
    name.value === "" ||
    number.value.length !== 19 ||
    date.value.length !== 5 ||
    isNotDate(date) === true ||
    cvv.value.length < 3
  ) {
    e.preventDefault();
  }

  // 5. if any input is empty show the alert of that input
  let input = document.querySelectorAll("input");
  for (let i = 0; i < input.length; i++) {
    if (input[i].value === "") {
      input[i].nextElementSibling.style.opacity = "1";
    }
  }
  finalizeTickets();
});
