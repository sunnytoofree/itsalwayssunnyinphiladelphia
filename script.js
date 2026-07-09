const playCtrl = document.getElementById('play-ctrl');
const monkeyOverlay = document.getElementById('monkey-overlay');
const prankAudio = document.getElementById('prank-audio');
const boingTemplate = document.getElementById('boing-audio');

const PRANK_DELAY_MS = 8000;

let playing = false;
let boingInterval;
let audioUnlocked = false;
let prankStarted = false;
let prankPending = false;

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  [prankAudio, boingTemplate].forEach((audio) => {
    const wasMuted = audio.muted;
    audio.muted = true;
    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = wasMuted;
      })
      .catch(() => {
        audio.muted = wasMuted;
      });
  });

  if (prankPending) {
    startPrank();
  }
}

function playBoing() {
  const boing = boingTemplate.cloneNode();
  boing.volume = 0.7;
  boing.play().catch(() => {});
}

function startBoings() {
  playBoing();
  if (boingInterval) clearInterval(boingInterval);
  boingInterval = setInterval(playBoing, 5000);
}

function startPrank() {
  if (prankStarted) return;
  prankStarted = true;
  prankPending = false;

  monkeyOverlay.hidden = false;
  prankAudio.currentTime = 0;
  prankAudio.play().catch(() => {});
  startBoings();
}

playCtrl.addEventListener('click', () => {
  unlockAudio();
  playing = !playing;
  playCtrl.textContent = playing ? '⏸ Pause' : '▶ Play';
});

document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('touchstart', unlockAudio, { once: true });

setTimeout(() => {
  if (audioUnlocked) {
    startPrank();
  } else {
    prankPending = true;
    monkeyOverlay.hidden = false;
  }
}, PRANK_DELAY_MS);
