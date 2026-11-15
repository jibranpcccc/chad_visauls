import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7 } from './shots';

const mirrorLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.1 * lv}) contrast(${1 + 0.06 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="MIRROR HACK" icon="dot" />,
};

export const nichePsych = defineEpisode('Niche-Psych', {
  timeline: timeline as Timeline,
  shots: { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7 },
  looks: { mirror: mirrorLook },
});
