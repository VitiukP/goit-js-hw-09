// Import the required libraries
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

// Get elements from the DOM
const dateTimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

// Function to format time values with leading zeros
function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

// Function to update the timer display
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

// Function to calculate time difference and start the countdown
function startCountdown(targetDate) {
  const interval = setInterval(() => {
    const currentTime = new Date().getTime();
    const timeDifference = targetDate - currentTime;

    if (timeDifference <= 0) {
      clearInterval(interval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      alert("Countdown finished!");
      return;
    }

    const timeObject = convertMs(timeDifference);
    updateTimerDisplay(timeObject);
  }, 1000);
}

// Function to convert milliseconds to days, hours, minutes, and seconds
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Initialize flatpickr with options
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      flatpickr.clear(dateTimePicker);
      alert("Please choose a date in the future.");
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(dateTimePicker, options);

// Event listener for the start button
startButton.addEventListener("click", () => {
  const selectedDate = flatpickr.parseDate(dateTimePicker.value);
  startCountdown(selectedDate);
});
