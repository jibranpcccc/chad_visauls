import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh10, Sh11 } from './shots';

const pauseLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.14 * lv}) hue-rotate(${10 * lv}deg)`,
  Overlay: ({ f }) => <HudChip f={f} label="PAUSED" icon="pause" />,
};

export const duskPause = defineEpisode('Dusk-Pause', {
  timeline: timeline as Timeline,
  shots: { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh10, Sh11 },
  looks: { pause: pauseLook },
});
