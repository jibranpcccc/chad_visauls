export type DialogueTurn = {
  id: string;
  speaker: string;
  text: string;
  startSec: number;
  endSec: number;
  startF: number;
  endF: number;
};

/**
 * Returns 0..1 mouth open fraction synchronized with active speaking windows in dialogue.json.
 */
export const talkWave = (f: number, turns: DialogueTurn[], speaker: string): number => {
  for (const t of turns) {
    if (t.speaker === speaker && f >= t.startF && f <= t.endF) {
      const local = f - t.startF;
      const env = Math.min(1, local / 3, (t.endF - f) / 3);
      const syllable = 0.35 + 0.65 * Math.abs(Math.sin(local * 0.92) * Math.cos(local * 0.43 + 0.5));
      return Math.max(0, Math.min(1, env * syllable));
    }
  }
  return 0;
};

/**
 * Natural 2-frame eye blink at given local clock t (never overlaps frame 0).
 */
export const naturalBlink = (t: number, period = 68, offset = 18): number => {
  const m = (t + offset) % period;
  return m === 0 || m === 1 ? 1 : 0;
};
