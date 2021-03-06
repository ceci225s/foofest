//------------------------ FETCH ALL DATA

//Fetch bands
export async function loadBandJson() {
  const bands = await fetch("https://foo-techno-fest.herokuapp.com/bands", {
    method: "GET",
  });
  let bandJson = await bands.json();
  return bandJson;
}

//------------------------ APP
//Camping spots
export async function loadSpots() {
  let availableSpots = await fetch(
    "https://foo-techno-fest.herokuapp.com/available-spots",
    {
      method: "GET",
    }
  );
  const availableSpotsJson = await availableSpots.json();
  return availableSpotsJson;
}
//------------------------ TICKET RESERVATION

export async function reserveTickets(bookingInfo) {
  const payload = {
    area: bookingInfo.campingArea,
    amount: bookingInfo.ticketQuantity,
  };
  console.log(payload);

  await fetch("https://foo-techno-fest.herokuapp.com/reserve-spot", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      bookingInfo.id = data.id;
      // console.log(data);
    })
    .catch((err) => console.error(err));
  return bookingInfo.id;
}

//------------------------ TICKET RESERVATION final

export async function finalizeOrder(bookingInfo) {
  let reservationId = {
    id: bookingInfo.id,
  };
  console.log(reservationId);

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
export function postToDatabase(bookingInfo) {
  const url = "https://frontend-0eac.restdb.io/rest/foofest-booking";
  const apiKey = "6245615567937c128d7c9395";
  console.log(bookingInfo);

  POST(bookingInfo, url, apiKey);

  async function POST(bookingInfo, url, apiKey) {
    let bookingData = await fetch(url, {
      async: true,
      crossDomain: true,
      url: url,
      method: "post",
      body: JSON.stringify(bookingInfo),
      headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
        "cache-control": "no-cache",
      },
    });
    let data = await bookingData.json();
    // console.log(data);
  }
}
