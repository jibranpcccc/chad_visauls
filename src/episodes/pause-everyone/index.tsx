import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16 } from './shots';

const pauseLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.18 * lv}) hue-rotate(${-12 * lv}deg) brightness(${1 + 0.03 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="PAUSED" icon="copy" />,
};

const unpauseLook: LookDef = {
  Overlay: ({ f }) => <HudChip f={f} label="LIVE" icon="paste" />,
};

export const pauseEveryone = defineEpisode('PauseEveryone', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16 },
  looks: { pause: pauseLook, unpause: unpauseLook },
});
