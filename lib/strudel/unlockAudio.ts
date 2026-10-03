import { getAudioContext } from "@strudel/webaudio";

let silence: HTMLAudioElement | null = null;

function silentWavUrl() {
  const sampleRate = 8000;
  const samples = sampleRate / 2;
  const buffer = new ArrayBuffer(44 + samples);
  const view = new DataView(buffer);
  const write = (offset: number, text: string) =>
    [...text].forEach((char, i) =>
      view.setUint8(offset + i, char.charCodeAt(0)),
    );
  write(0, "RIFF");
  view.setUint32(4, 36 + samples, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  write(36, "data");
  view.setUint32(40, samples, true);
  // 8-bit PCM silence is the midpoint value.
  new Uint8Array(buffer, 44).fill(128);
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

// iOS mutes Web Audio while the ringer switch is silent unless the page uses
// the "playback" audio session, or is already playing a media element.
function enablePlaybackSession() {
  const session = (navigator as Navigator & { audioSession?: { type: string } })
    .audioSession;
  if (session) {
    session.type = "playback";
    return;
  }
  if (!silence) {
    silence = new Audio(silentWavUrl());
    silence.loop = true;
    silence.setAttribute("playsinline", "");
    silence.setAttribute("x-webkit-airplay", "deny");
  }
  silence.play().catch(() => {});
}

// Call synchronously from a user gesture (click, pointerup, touchend, keydown).
export function unlockAudio(): Promise<void> {
  enablePlaybackSession();
  const context = getAudioContext();
  // Older iOS only unlocks once a sound starts inside the gesture.
  const source = context.createBufferSource();
  source.buffer = context.createBuffer(1, 1, context.sampleRate);
  source.connect(context.destination);
  source.start(0);
  return context.state === "running" ? Promise.resolve() : context.resume();
}
