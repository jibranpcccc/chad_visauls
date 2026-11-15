import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8 } from './shots';

const rewindLook: LookDef = {
  grade: (lv) => `saturate(${1 + 0.08 * lv}) contrast(${1 + 0.05 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="REWIND -5s" icon="rewind" />,
};

export const nicheWhatif = defineEpisode('Niche-WhatIf', {
  timeline: timeline as Timeline,
  shots: { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8 },
  looks: { rewind: rewindLook },
});
