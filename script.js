const playCtrl = document.getElementById('play-ctrl');
const monkeyOverlay = document.getElementById('monkey-overlay');
const prankAudio = document.getElementById('prank-audio');
const boingTemplate = document.getElementById('boing-audio');
let playing = false;
let boingInterval;

function playBoing() {
  const boing = boingTemplate.cloneNode();
  boing.volume = 0.7;
  boing.play().catch(() => {});
}

function startBoings() {
  playBoing();
  boingInterval = setInterval(playBoing, 5000);
}

playCtrl.addEventListener('click', () => {
  playing = !playing;
  playCtrl.textContent = playing ? '⏸ Pause' : '▶ Play';
});

const PRANK_DELAY_MS = 8000;

setTimeout(() => {
  monkeyOverlay.hidden = false;
  prankAudio.play().catch(() => {});
  startBoings();
}, PRANK_DELAY_MS);
