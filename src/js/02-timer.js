import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

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

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

document.addEventListener("DOMContentLoaded", () => {
  const datePicker = document.getElementById("datetime-picker");
  const startButton = document.querySelector("button[data-start]");
  const daysElement = document.querySelector("[data-days]");
  const hoursElement = document.querySelector("[data-hours]");
  const minutesElement = document.querySelector("[data-minutes]");
  const secondsElement = document.querySelector("[data-seconds]");
  let countdownInterval;

  flatpickr(datePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      const currentDate = new Date();

     if (!selectedDate || selectedDate <= currentDate) {
          Notiflix.Notify.failure("Please choose a valid date in the future");
          startButton.disabled = true;
        } else {
          startButton.disabled = false;
        }
    },
  });

  function updateTimer() {
    const selectedDate = new Date(datePicker.value).getTime();
    const currentDate = new Date().getTime();
    const countdownTime = selectedDate - currentDate;

    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      startButton.disabled = false;
      Notiflix.Notify.success("The timer is stopped");
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(countdownTime);

    daysElement.textContent = addLeadingZero(days);
    hoursElement.textContent = addLeadingZero(hours);
    minutesElement.textContent = addLeadingZero(minutes);
    secondsElement.textContent = addLeadingZero(seconds);
    startButton.disabled = true;
  }

  startButton.addEventListener("click", () => {
    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  });
});