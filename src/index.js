let apiKey = "c48220bc58aa270f2b032dac0b7f1917";
let temp = document.querySelector("h2 #temp");
let currentH1 = document.querySelector("h1");
let input = document.querySelector("input");
let lastClicked = "C"
let inputValue = input.value;


let description = document.querySelector("h3")
let weatherImage = document.querySelector("#mainWeatherImage");

function onChange(event) {
    inputValue = event.target.value;
}

input.addEventListener("keyup", onChange);

function updateTemp(event) {
    event.preventDefault();
    let apiCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&&units=metric`;
    lastClicked = "C"
    axios.get(apiCityURL).then(successResponse, failResponse)
}

function successResponse(resp) {
    console.log(resp)
    let icon = resp.data.weather[0].icon;
    let imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
    weatherImage.src = imageUrl;
    description.innerHTML = resp.data.weather[0].description
    currentH1.innerHTML = input.value || resp.data.name;
    temp.innerHTML = Math.round(resp.data.main.temp)
    input.value = "";
}

function failResponse(error) {
    console.log(error.message)
    temp.innerHTML = "No weather to display"
    input.value = ""
    input.placeholder = "Please try a valid city"
    currentH1.innerHTML = "Please try again"
}

function showPosition(position) {
    let lon = position.coords.longitude;
    let lat = position.coords.latitude;
    let apiLATAndLOGUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&&units=imperial`;
    axios.get(`${apiLATAndLOGUrl}&appid=${apiKey}`).then(successResponse, failResponse);
}



function getCurrentWeather() {
    navigator.geolocation.getCurrentPosition(showPosition);
}

const tempConverter = (event) => {
    let unit = event.target.innerHTML
    let tempValue = temp.innerHTML
    if (tempValue === "" || tempValue === "No weather to display") {
        return;
    }

    if (unit === 'F' && lastClicked !== "F") {
        temp.innerHTML = `${Math.round((+tempValue * (9 / 5)) + 32)}`;
        lastClicked = "F"
    } else if (unit === "C" && lastClicked !== "C") {
        lastClicked = "C"
        temp.innerHTML = `${Math.round((+tempValue - 32) * (5 / 9))}`;
    }
}


let submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", updateTemp);
let localButton = document.querySelector("#localButton")
localButton.addEventListener("click", getCurrentWeather)

let now = new Date(); //add ability to dynamically update date
let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
let minutes = now.getMinutes().toString();

if (minutes.length === 1) {
    minutes = "0" + minutes
}



let currentTime = `${days[now.getDay()]} ${now.getHours()}:${minutes}`;
let date = document.querySelector("#date");
date.innerHTML = currentTime;


document.querySelector("h2").addEventListener("click", tempConverter)