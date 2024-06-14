import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const refs = {
  startBtn: document.querySelector('[data-start]'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
  datetimePicker: document.querySelector('#datetime-picker'),
};

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      iziToast.show({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: 'red',
        messageColor: 'white',
        titleColor: 'white',
      });
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDates[0];
      refs.startBtn.disabled = false;
    }
  },
};
flatpickr('#datetime-picker', options);
let intervalId;

refs.startBtn.addEventListener('click', () => {
  const initTime = userSelectedDate;
  refs.startBtn.disabled = true;
  refs.datetimePicker.disabled = true;

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const diff = initTime - currentTime;
    const time = convertMs(diff);
    const str = getTime(time);

    refs.dataSeconds.textContent = str.seconds;
    refs.dataMinutes.textContent = str.minutes;
    refs.dataHours.textContent = str.hours;
    refs.dataDays.textContent = str.days;
  }, 1000);

  setTimeout(() => {
    clearInterval(intervalId);
    refs.datetimePicker.disabled = false;
  }, initTime - Date.now());
});

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

function getTime({ days, hours, minutes, seconds }) {
  days = days.toString().padStart(2, '0');
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');

  return { days, hours, minutes, seconds };
}
