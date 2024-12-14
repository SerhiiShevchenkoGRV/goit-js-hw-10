import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import iconError from '../img/error-white.svg';

const input = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
const timerBox = document.querySelector('.timer');
const daysValue = timerBox.querySelector('[data-days]');
const hoursValue = timerBox.querySelector('[data-hours]');
const minutesValue = timerBox.querySelector('[data-minutes]');
const secondsValue = timerBox.querySelector('[data-seconds]');

let userSelectedDate = null;
let intervalId = null;
startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = new Date();

    if (currentDate >= selectedDates[0]) {
      startButton.disabled = true;
      input.disabled = true;
      iziToast.show({
        title: 'Error',
        titleColor: '#fff',
        titleSize: '16px',
        titleLineHeight: '1.5',
        message: 'Please choose a date in the future',
        messageSize: '16px',
        messageLineHeight: '1.5',
        messageColor: '#fff',
        color: '#ef4040',
        position: 'topRight',
        timeout: 5000,
        iconUrl: iconError,
        iconColor: '#fafafb',
        theme: 'dark',
      });
      return;
    }

    startButton.disabled = false;
    userSelectedDate = selectedDates[0];
    console.log('Chosen date', userSelectedDate);
  },
};

flatpickr(input, options);

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

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

const startTimer = () => {
  startButton.disabled = true;
  input.disabled = true;

  intervalId = setInterval(() => {
    const currentDate = new Date();
    const ms = userSelectedDate - currentDate;

    if (ms <= 0) {
      clearInterval(intervalId);
      console.log('Timer completed');
      input.disabled = false;
      startButton.disabled = true;
      return;
    }

    const time = convertMs(ms);
    updateTimerDisplay(time);
  }, 1000);
};

startButton.addEventListener('click', startTimer);
