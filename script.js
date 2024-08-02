const selectEl = document.getElementById("city");
selectEl.addEventListener("change", findTime);

// Create all options from timezone
const createOptions = (data) => {
  const optionEls = data.map(
    (city) => `<option value="${city}">${city}</option>`
  );
  selectEl.insertAdjacentHTML("afterbegin", optionEls.join(""));
};

fetch("https://worldtimeapi.org/api/timezone")
  .then((res) => {
    if (!res.ok) {
      throw Error("fetch error");
    }
    return res.json();
  })
  .then((data) => {
    createOptions(data);
  })
  .catch((err) => console.log(err));

// Create and insert hour numbers
const hourNumberContainer = document.querySelector(".hour-number");
const hourNumbers = [];
for (let i = 1; i <= 12; i++) {
  hourNumbers.push(`<span style="--index:${i}"><p>${i}</p></span>`);
}
hourNumberContainer.insertAdjacentHTML("afterbegin", hourNumbers.join(""));

// Create and insert second bars
const secondBarContainer = document.querySelector(".bar-second");
const secondBars = [];
for (let i = 1; i <= 60; i++) {
  secondBars.push(`<span style="--index:${i}"><p></p></span>`);
}
secondBarContainer.insertAdjacentHTML("afterbegin", secondBars.join(""));

// Select the clock hands from the DOM
const hourHand = document.querySelector(".hour");
const minuteHand = document.querySelector(".minute");
const secondHand = document.querySelector(".second");
const ampmEL = document.querySelector(".am-pm");

let time;
let intervalId;
let ampm;

// Function to fetch time for the selected city
function findTime() {
  const city = selectEl.value;
  console.log(city);

  fetch(`https://worldtimeapi.org/api/timezone/${city}`)
    .then((res) => {
      if (!res.ok) {
        throw Error("fetch error");
      }
      return res.json();
    })
    .then((data) => {
      // Create a new Date object from the UTC date string
      const date = new Date(data.datetime);

      // Convert the date to the local time in the specified time zone
      time = new Date(date.toLocaleString("en-US", { timeZone: city }));

      updateClockHands();

      // Clear the previous interval and set a new one
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (time) {
          time.setSeconds(time.getSeconds() + 1);
          updateClockHands();
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
}

// Function to update the clock hands to display the current time
const updateClockHands = () => {
  const currentTime = time || new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  ampm = hours >= 12 ? "PM" : "AM";

  // Calculate the rotation angles for each clock hand
  const hourHandRotationAngle = (hours % 12) * 30 + minutes / 2; // Hours range from 0-11
  const minuteHandRotationAngle = minutes * 6; // 360 degrees / 60 minutes = 6 degrees per minute
  const secondHandRotationAngle = seconds * 6; // 360 degrees / 60 seconds = 6 degrees per second

  ampmEL.innerText = ampm;

  // Apply the calculated rotation angles to the clock hands
  hourHand.style.transform = `rotate(${hourHandRotationAngle}deg)`;
  minuteHand.style.transform = `rotate(${minuteHandRotationAngle}deg)`;
  secondHand.style.transform = `rotate(${secondHandRotationAngle}deg)`;
};

// Call the function initially to set the clock immediately
if (!time) {
  setInterval(updateClockHands, 1000);
}
