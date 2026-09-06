let audioEnabled = localStorage.getItem('puzzleplay_audio') !== 'false';
let bgmOsc: OscillatorNode | null = null;
let bgmGain: GainNode | null = null;
let audioCtx: AudioContext | null = null;

export const setAudioEnabled = (enabled: boolean) => {
  audioEnabled = enabled;
  localStorage.setItem('puzzleplay_audio', String(enabled));
  if (!enabled) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
};

export const getAudioEnabled = () => audioEnabled;

export const startBackgroundMusic = () => {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
    }
    if (bgmOsc) return; // already playing
    
    bgmOsc = audioCtx.createOscillator();
    bgmGain = audioCtx.createGain();
    
    bgmOsc.type = 'sine';
    bgmOsc.frequency.setValueAtTime(180, audioCtx.currentTime);
    
    bgmGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    
    bgmOsc.connect(bgmGain);
    bgmGain.connect(audioCtx.destination);
    
    bgmOsc.start();
  } catch (e) {
    console.warn("BGM not supported", e);
  }
};

export const stopBackgroundMusic = () => {
  if (bgmOsc) {
    bgmOsc.stop();
    bgmOsc.disconnect();
    bgmOsc = null;
  }
  if (bgmGain) {
    bgmGain.disconnect();
    bgmGain = null;
  }
};

export const playCorrectSound = () => {
  if (!audioEnabled) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Jump to A5
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio not supported or interaction needed.", e);
  }
};

export const playIncorrectSound = () => {
  if (!audioEnabled) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio not supported or interaction needed.", e);
  }
};

export const playPopSound = () => {
  if (!audioEnabled) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(950, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    // ignore
  }
};

export const playFanfareSound = () => {
  if (!audioEnabled) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      const start = audioCtx.currentTime + index * 0.12;
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch (e) {
    // ignore
  }
};
