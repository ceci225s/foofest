//------------------------ SHOW BANDS

export function displayLineup(bandJson) {
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
  // MOVE LINEUP SECTION TO THE RIGHT
  document.querySelector("#program").classList.remove("active_up");

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
