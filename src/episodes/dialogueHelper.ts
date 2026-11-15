export type DialogueTurn = {
  id: string;
  speaker: string;
  text: string;
  startSec: number;
  endSec: number;
  startF: number;
  endF: number;
  words?: { word: string; startF: number; endF: number }[];
};

export type MouthMap = Record<string, number[]>;

/**
 * Returns exact 0..1 audio-RMS mouth openness for a given global frame f and speaker.
 */
export const talkAt = (f: number, mouthFrames: MouthMap, speaker: string): number => {
  const arr = mouthFrames[speaker];
  if (!arr || f < 0 || f >= arr.length) return 0;
  return arr[Math.floor(f)] ?? 0;
};

/**
 * Natural 2-frame eye blink at given local clock t (never overlaps frame 0).
 */
export const naturalBlink = (t: number, period = 68, offset = 18): number => {
  const m = (t + offset) % period;
  return m === 0 || m === 1 ? 1 : 0;
};
