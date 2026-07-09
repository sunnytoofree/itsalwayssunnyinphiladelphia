const playCtrl = document.getElementById('play-ctrl');
const monkeyOverlay = document.getElementById('monkey-overlay');
const prankAudio = document.getElementById('prank-audio');
const boingAudio = document.getElementById('boing-audio');

const PRANK_DELAY_MS = 8000;
const BOING_SRC = 'boing.mp3';

let playing = false;
let boingInterval;
let audioUnlocked = false;
let prankStarted = false;
let monkeyVisible = false;

prankAudio.load();
boingAudio.load();

function unlockAudio() {
  if (audioUnlocked) return Promise.resolve();
  audioUnlocked = true;

  const silentUnlock = (audio) => {
    const prevVolume = audio.volume;
    audio.volume = 0.001;
    return audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = prevVolume;
      })
      .catch(() => {
        audio.volume = prevVolume;
      });
  };

  return Promise.all([silentUnlock(prankAudio), silentUnlock(boingAudio)]);
}

function playBoing() {
  const boing = new Audio(BOING_SRC);
  boing.volume = 0.7;
  boing.play().catch(() => {});
}

function startBoings() {
  playBoing();
  if (boingInterval) clearInterval(boingInterval);
  boingInterval = setInterval(playBoing, 5000);
}

function startPrankAudio() {
  if (prankStarted || !monkeyVisible) return;
  prankStarted = true;

  prankAudio.loop = true;
  prankAudio.volume = 1;
  prankAudio.currentTime = 0;
  prankAudio.play().catch(() => {});
  startBoings();
}

function showMonkey() {
  monkeyVisible = true;
  monkeyOverlay.hidden = false;
  if (audioUnlocked) {
    startPrankAudio();
  }
}

function onUserActivate() {
  unlockAudio().then(() => {
    if (monkeyVisible) {
      startPrankAudio();
    }
  });
}

playCtrl.addEventListener('click', () => {
  onUserActivate();
  playing = !playing;
  playCtrl.textContent = playing ? '⏸ Pause' : '▶ Play';
});

document.addEventListener('click', onUserActivate);
document.addEventListener('touchstart', onUserActivate, { passive: true });

setTimeout(showMonkey, PRANK_DELAY_MS);
