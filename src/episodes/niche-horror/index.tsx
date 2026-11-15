import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7 } from './shots';

const horrorLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.25 * lv}) contrast(${1 + 0.14 * lv}) brightness(${1 - 0.08 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="03:12 AM" icon="dot" />,
};

export const nicheHorror = defineEpisode('Niche-Horror', {
  timeline: timeline as Timeline,
  shots: { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7 },
  looks: { horror: horrorLook },
});
