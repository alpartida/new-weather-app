let apiKey = "c48220bc58aa270f2b032dac0b7f1917";
let temps = document.querySelectorAll(".temp");
let currentH1 = document.querySelector("h1");
let input = document.querySelector("input");
let lastClicked = "C";
let inputValue = input.value;

let description = document.querySelector("h3");
let weatherImage = document.querySelector("#mainWeatherImage");

function onChange(event) {
  inputValue = event.target.value;
}

input.addEventListener("keyup", onChange);

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayForecast(successResponse) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = ""
  let forecast = null;

  for (let index = 0; index < 4; index++) {
    forecast = successResponse.data.list[index];
    forecastElement.innerHTML += `
  <div class="col">
    <h4>${formatHours(forecast.dt * 1000)}</h4>
    <p><span class=temp>${Math.round(forecast.main.temp_max)}</span>°<a style="color:#92a3a7"; href="#" onclick="return false";>C</a> | <a style="color:#92a3a7"; href="#" onclick="return false";>F</a></p>
    <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png">
  </div>
          `;
  }
  temps = document.querySelectorAll(".temp");
}
function updateTemp(event) {
  event.preventDefault();
  let apiCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&&units=metric`;
  lastClicked = "C";
  axios.get(apiCityURL).then(successResponse, failResponse);

  apiCityURL = `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&appid=${apiKey}&&units=metric`;
  lastClicked = "C";
  axios.get(apiCityURL).then(displayForecast);
}

function successResponse(resp) {
  console.log(resp);
  let icon = resp.data.weather[0].icon;
  let imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherImage.src = imageUrl;
  description.innerHTML = resp.data.weather[0].description;
  currentH1.innerHTML = input.value || resp.data.name;
  temps[0].innerHTML = Math.round(resp.data.main.temp);
  input.value = "";
}

function failResponse(error) {
  console.log(error.message);
  temp.innerHTML = "No weather to display";
  input.value = "";
  input.placeholder = "Please try a valid city";
  currentH1.innerHTML = "Please try again";
}

function showPosition(position) {
  lastClicked = "C";
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiLATAndLOGUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&&units=metric`;
  axios
    .get(`${apiLATAndLOGUrl}`)
    .then(successResponse, failResponse);

  apiLATAndLOGUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&&units=metric`;
  axios.get(apiLATAndLOGUrl).then(displayForecast);
}

function getCurrentWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

const tempConverter = (event) => {
  let unit = event.target.innerHTML;
  for (let i = 0; i < temps.length; i++) {
    let tempValue = temps[i].innerHTML;
    if (tempValue === "" || tempValue === "No weather to display") {
      return;
    }


    if (unit === "F" && lastClicked !== "F") {
      temps[i].innerHTML = `${Math.round(+tempValue * (9 / 5) + 32)}`;
    } else if (unit === "C" && lastClicked !== "C") {
      temps[i].innerHTML = `${Math.round((+tempValue - 32) * (5 / 9))}`;
    }

  }
  if (unit === "F" && lastClicked !== "F") {
    lastClicked = "F"
  } else if (unit === "C" && lastClicked !== "C") {
    lastClicked = "C"
  }
};

let submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", updateTemp);
let localButton = document.querySelector("#localButton");
localButton.addEventListener("click", getCurrentWeather);

let now = new Date(); //add ability to dynamically update date
let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
let minutes = now.getMinutes().toString();

if (minutes.length === 1) {
  minutes = "0" + minutes;
}

let currentTime = `${days[now.getDay()]} ${now.getHours()}:${minutes}`;
let date = document.querySelector("#date");
date.innerHTML = currentTime;

document.querySelector(".container").addEventListener("click", tempConverter);
