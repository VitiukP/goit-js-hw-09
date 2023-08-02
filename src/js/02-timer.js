 import flatpickr from "flatpickr";
  import "flatpickr/dist/flatpickr.min.css";
  import Notiflix from 'notiflix';

  const datetimePicker = document.getElementById("datetime-picker");
  const startButton = document.querySelector('[data-start]');
  const daysValue = document.querySelector('[data-days]');
  const hoursValue = document.querySelector('[data-hours]');
  const minutesValue = document.querySelector('[data-minutes]');
  const secondsValue = document.querySelector('[data-seconds]');

  function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }

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
 function updateTimer() {
    const selectedDate = new Date(datetimePicker.value);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      Notiflix.Notify.failure("Please choose a date in the future");
      clearInterval(timerInterval);
      startButton.disabled = true;
      return;
    }

    const remainingTime = selectedDate - currentDate;
    const { days, hours, minutes, seconds } = convertMs(remainingTime);

    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      startButton.disabled = true;
    }
  }
let timerInterval;

function startTimer() {
    if (!timerInterval) {
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
        startButton.disabled = true;
    }
}

flatpickr("#datetime-picker", {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate && selectedDate > new Date()) {
            startButton.disabled = false;
        }
        else {
            startButton.disabled = true;
        }
    }
});

startButton.addEventListener("click", startTimer);