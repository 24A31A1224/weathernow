// -----------------------------
// GLOBAL VARIABLES
// -----------------------------
let isCelsius = true;

// -----------------------------
// GET WEATHER BY CITY SEARCH
// -----------------------------
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const loading = document.getElementById("loading");

  if (city === "") {
    alert("Enter city name");
    return;
  }

  loading.style.display = "block";

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);

    if (!res.ok) {
      alert("City not found");
      loading.style.display = "none";
      return;
    }

    const data = await res.json();
    showWeatherUI(data);
  } catch (error) {
    alert("Error fetching data");
  }

  loading.style.display = "none";
}

// -----------------------------
// GET WEATHER BY USER LOCATION
// -----------------------------
window.onload = () => {
  askLocationPermission();
};

function askLocationPermission() {
  navigator.geolocation.getCurrentPosition(
    successLocation,
    locationError
  );
}

function successLocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetchWeatherByCoords(lat, lon);
}

function locationError(error) {
  document.getElementById("locationLabel").innerText =
    "📍 Please allow location access";

  console.log(error);
}


function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      showWeatherUI(data);
    })
    .catch(() => {
      alert("Unable to fetch location weather");
    });
}
function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      showWeatherUI(data);
    })
    .catch(() => {
      alert("Failed to load location weather");
    });
}



// -----------------------------
// DISPLAY BOTH CURRENT + FORECAST
// -----------------------------
function showWeatherUI(data) {
  displayCurrentWeather(data);
  displayForecast(data);

  document.getElementById("currentWeather").classList.add("fade");
  document.getElementById("forecast").classList.add("fade");
}

// -----------------------------
// CURRENT WEATHER
// -----------------------------
function displayCurrentWeather(data) {
  const weather = data.list[0];

  // Update location label
  document.getElementById("locationLabel").innerText =
    "📍 " + data.city.name;

  // Show weather UI
  document.getElementById("currentWeather").innerHTML = `
    <h2>${data.city.name}</h2>
    <img class="main-icon"
      src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">
    <h3 id="tempValue">${weather.main.temp}°C</h3>
    <p>${weather.weather[0].description}</p>
  `;
}


// -----------------------------
// 5 DAY FORECAST
// -----------------------------
function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    const day = data.list[i];
    const date = new Date(day.dt_txt).toDateString();

    forecastDiv.innerHTML += `
      <div class="card">
        <h4>${date}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
        <p>${day.main.temp}°C</p>
      </div>
    `;
  }
}

// -----------------------------
// DARK MODE
// -----------------------------
const toggleBtn = document.getElementById("themeToggle");

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
};

// -----------------------------
// UNIT CONVERTER
// -----------------------------
document.getElementById("unitToggle").onclick = () => {
  const tempText = document.getElementById("tempValue");
  let temp = parseFloat(tempText.innerText);

  if (isCelsius) {
    temp = (temp * 9 / 5) + 32;
    tempText.innerText = temp.toFixed(1) + "°F";
    unitToggle.innerText = "°C";
  } else {
    temp = (temp - 32) * 5 / 9;
    tempText.innerText = temp.toFixed(1) + "°C";
    unitToggle.innerText = "°F";
  }

  isCelsius = !isCelsius;
};
