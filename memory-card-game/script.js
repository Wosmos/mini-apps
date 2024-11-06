let audioContext;
let bgMusic;
let audioInitialized = false;
let volume = 0.5;

const SOUNDS = {
  flip: [261.63, 329.63], // C4, E4
  match: [523.25, 659.25], // C5, E5
  victory: [523.25, 659.25, 783.99], // C5, E5, G5
  bgMusic: null,
};

// Initialize audio
async function initAudio() {
  if (audioInitialized) return;

  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create background music
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4

  gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  SOUNDS.bgMusic = { oscillator, gainNode };
  audioInitialized = true;
}

function playSound(type) {
  if (!audioContext || !soundEnabled) return;

  const frequencies = SOUNDS[type];
  if (!frequencies) return;

  frequencies.forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01 * volume,
      audioContext.currentTime + 0.5
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  });
}

function toggleBackgroundMusic() {
  if (!SOUNDS.bgMusic) return;

  if (soundEnabled) {
    SOUNDS.bgMusic.oscillator.start();
  } else {
    SOUNDS.bgMusic.oscillator.stop();
    initAudio(); // Reinitialize for next play
  }
}

function updateVolume(value) {
  volume = value / 100;
  if (SOUNDS.bgMusic && SOUNDS.bgMusic.gainNode) {
    SOUNDS.bgMusic.gainNode.gain.setValueAtTime(
      0.1 * volume,
      audioContext.currentTime
    );
  }
}

// Enhanced event listeners
function setupEventListeners() {
  // Previous event listeners remain the same

  // Modal close button
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('winModal').classList.remove('visible');
  });

  // Click outside modal to close
  document.getElementById('winModal').addEventListener('click', (e) => {
    if (e.target.id === 'winModal') {
      e.target.classList.remove('visible');
    }
  });

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('winModal').classList.remove('visible');
    }
  });

  // Volume control
  document.getElementById('volumeSlider').addEventListener('input', (e) => {
    updateVolume(e.target.value);
  });

  // Initialize audio on first user interaction
  document.addEventListener(
    'click',
    () => {
      if (!audioInitialized) {
        initAudio();
      }
    },
    { once: true }
  );
}

// Enhanced game state management
function startLevel(level) {
  // Previous startLevel code remains the same

  if (soundEnabled && !audioInitialized) {
    initAudio();
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = document.querySelector('#soundToggle i');
  icon.className = soundEnabled ? 'fas fa-music' : 'fas fa-music-slash';

  if (soundEnabled) {
    if (!audioInitialized) {
      initAudio();
    }
    toggleBackgroundMusic();
  } else {
    if (SOUNDS.bgMusic) {
      SOUNDS.bgMusic.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    }
  }
}

// Previous game logic remains the same

// Initialize game
window.addEventListener('load', () => {
  initializeGame();
  setupEventListeners();
});
