async function getAccessToken() {
  const response = await axios.get("/api/token");
  return response.data.token;
}

async function searchSongs(keyword) {
  const token = await getAccessToken();
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    keyword
  )}&type=track&limit=5`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.tracks.items;
}

function displaySongs(songs) {
  let songElement = document.querySelector("#song");
  songElement.classList.remove("hidden");

  if (songs.length === 0) {
    songElement.innerHTML = "No songs found.";
    return;
  }

  let html = "<h3>Top Matches:</h3><ul>";
  songs.forEach((song) => {
    html += `<li><strong>${song.name}</strong> by ${song.artists[0].name}<br/><a href="${song.external_urls.spotify}" target="_blank">Listen on Spotify</a></li>`;
  });
  html += "</ul>";
  songElement.innerHTML = html;
}

async function generateMusic(event) {
  event.preventDefault();
  let promptInput = document.querySelector("#user-prompt");
  let keyword = promptInput.value.trim();

  if (!keyword) return;

  document.querySelector("#song").innerHTML = "Loading...";
  document.querySelector("#song").classList.remove("hidden");

  try {
    const songs = await searchSongs(keyword);
    displaySongs(songs);
  } catch (error) {
    document.querySelector("#song").innerHTML =
      "Something went wrong. Please try again.";
    console.error(error);
  }
}

let form = document.querySelector("#music-generator-form");
form.addEventListener("submit", generateMusic);
