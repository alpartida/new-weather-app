function showCity(event) {
  event.preventDefault();
  let currentH1 = document.querySelector("h1");
  let input = document.querySelector("input");
  let inputValue = input.value;
  currentH1.innerHTML = `${inputValue}`;
}
let lastClicked = "C";
const tempConverter = (event) => {
  let unit = event.target.innerHTML;
  let temp = document.querySelector("h2 #temp");
  let tempValue = temp.innerHTML;

  if (unit === "F" && lastClicked !== "F") {
    temp.innerHTML = `${Math.round(+tempValue * (9 / 5) + 32)}`;
    lastClicked = "F";
  } else if (unit === "C" && lastClicked !== "C") {
    lastClicked = "C";
    temp.innerHTML = `${Math.round((+tempValue - 32) * (5 / 9))}`;
  }
};
let button = document.querySelector("button");
button.addEventListener("click", showCity);

let now = new Date();
let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
let minutes = now.getMinutes().toString();

if (minutes.length === 1) {
  minutes = "0" + minutes;
}

let currentTime = `${days[now.getDay()]} ${now.getHours()}:${minutes}`;
let date = document.querySelector("#date");
date.innerHTML = currentTime;

document.querySelector("h2").addEventListener("click", tempConverter);
