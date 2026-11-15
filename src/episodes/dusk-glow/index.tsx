import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh10, Sh11, Sh12 } from './shots';

const glowLook: LookDef = {
  grade: (lv) => `saturate(${1 + 0.14 * lv}) brightness(${1 + 0.05 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="LUMEN+" icon="dot" />,
};

export const duskGlow = defineEpisode('Dusk-Glow', {
  timeline: timeline as Timeline,
  shots: { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh10, Sh11, Sh12 },
  looks: { glow: glowLook },
});
