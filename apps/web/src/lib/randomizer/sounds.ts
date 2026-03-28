import { readStorage, writeStorage } from "./local-storage";

const MUTE_KEY = "sound-muted";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof AudioContext === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isMuted(): boolean {
  return readStorage(MUTE_KEY, false);
}

export function setMuted(muted: boolean): void {
  writeStorage(MUTE_KEY, muted);
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  startTime = 0,
) {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
}

/** Short tick — tab switch, mode toggle, add/remove */
export function playClick(): void {
  if (isMuted()) return;
  tone(800, 0.06, "square", 0.08);
}

/** Rising sweep — main actions: spin, roll, flip, generate, draw, shuffle */
export function playWhoosh(): void {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

/** Bright chime — results: winner, dice land, card reveal */
export function playDing(): void {
  if (isMuted()) return;
  tone(880, 0.3, "sine", 0.15);
  tone(1320, 0.2, "sine", 0.08, 0.05);
}

/** Ascending arpeggio — celebrations: wheel all-done, bracket champion */
export function playFanfare(): void {
  if (isMuted()) return;
  tone(523, 0.2, "sine", 0.12, 0);     // C5
  tone(659, 0.2, "sine", 0.12, 0.12);   // E5
  tone(784, 0.2, "sine", 0.12, 0.24);   // G5
  tone(1047, 0.4, "sine", 0.15, 0.36);  // C6
}

/** Low thump — bracket matchup trigger */
export function playThud(): void {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}
