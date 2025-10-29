// Variables du timer
let totalSeconds = 0;
let timerInterval = null;
let isRunning = false;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const timerDisplay = document.getElementById("timerDisplay");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const alarmContainer = document.getElementById("alarmContainer");
const dismissBtn = document.getElementById("dismissBtn");

function updateDisplay() {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  timerDisplay.textContent = `${String(h).padStart(2, "0")}:${String(
    m
  ).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  if (totalSeconds <= 10 && totalSeconds > 0 && isRunning) {
    timerDisplay.classList.add("pulse");
  } else {
    timerDisplay.classList.remove("pulse");
  }
}

function playAlarm() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.5
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);

  setTimeout(() => playAlarm(), 500);
}

function showAlarm() {
  alarmContainer.style.display = "flex";
  playAlarm();
}

startBtn.addEventListener("click", () => {
  if (!isRunning) {
    if (totalSeconds === 0) {
      const h = parseInt(hoursInput.value) || 0;
      const m = parseInt(minutesInput.value) || 0;
      const s = parseInt(secondsInput.value) || 0;
      totalSeconds = h * 3600 + m * 60 + s;

      if (totalSeconds === 0) {
        alert("Veuillez définir un temps!");
        return;
      }
    }

    isRunning = true;
    timerInterval = setInterval(() => {
      totalSeconds--;
      updateDisplay();

      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        showAlarm();
      }
    }, 1000);
  }
});

pauseBtn.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  isRunning = false;
  totalSeconds = 0;
  updateDisplay();
  hoursInput.value = "";
  minutesInput.value = "";
  secondsInput.value = "";
});

dismissBtn.addEventListener("click", () => {
  alarmContainer.style.display = "none";
  resetBtn.click();
});

updateDisplay();
