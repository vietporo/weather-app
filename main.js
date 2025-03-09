const API_KEY = "8c08b7e481a547fcac981540250703";
const weatherInfo = document.getElementById("weather-info");
const error = document.getElementById("error");
const loading = document.getElementById("loading");

async function getWeatherByCity(cityName) {
  showLoading();
  try {
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7&aqi=no&alerts=yes`;
    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || "City not found");
    }

    displayWeather(data);
  } catch (err) {
    showError(err.message);
  }
}

function getWeather() {
  const cityInput = document.getElementById("city-input").value.trim();
  if (!cityInput) return;
  getWeatherByCity(cityInput);
}

function displayWeather(data) {
  weatherInfo.style.display = "block";
  error.style.display = "none";
  loading.style.display = "none";

  document.getElementById("city-name").textContent = data.location.name;
  document.getElementById("date").textContent = data.location.localtime;
  document.getElementById(
    "temperature"
  ).textContent = `${data.current.temp_c} °C`;
  document.getElementById("weather-description").textContent =
    data.current.condition.text;
  document.getElementById("weather-icon").src =
    "https:" + data.current.condition.icon;
  document.getElementById("weather-icon").alt = data.current.condition.text;
  document.getElementById(
    "feels-like"
  ).textContent = `${data.current.feelslike_c} °C`;
  document.getElementById(
    "humidity"
  ).textContent = `${data.current.humidity} %`;
  document.getElementById(
    "wind-speed"
  ).textContent = `${data.current.wind_kph} km/h`;
  document.getElementById("uv-index").textContent = data.current.uv;

  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
  data.forecast.forecastday.forEach((day) => {
    const forecastDay = document.createElement("div");
    forecastDay.className = "forecast-day";
    forecastDay.innerHTML = `
            <h3>${new Date(day.date).toLocaleDateString("en-US", {
              weekday: "long",
            })}</h3>
            <p>${day.date}</p>
            <img class="forecast-icon" src="https:${
              day.day.condition.icon
            }" alt="${day.day.condition.text}">
            <p>${Math.round(day.day.maxtemp_c)}°C / ${Math.round(
      day.day.mintemp_c
    )}°C</p>
            <p>${day.day.condition.text}</p>
        `;
    forecastContainer.appendChild(forecastDay);
  });
}

function showError(message) {
  error.style.display = "block";
  error.textContent = message;
  weatherInfo.style.display = "none";
  loading.style.display = "none";
}

function showLoading() {
  loading.style.display = "block";
  weatherInfo.style.display = "none";
  error.style.display = "none";
}

document
  .getElementById("city-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      getWeather();
    }
  });

window.addEventListener("load", () => {
  document.getElementById("city-input").value = "";
  getWeatherByCity("Ha Noi");
});
