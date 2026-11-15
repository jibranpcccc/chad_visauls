import React from "react";
import { Composition } from "remotion";
import "./engine/fonts";
import { copyPaste } from "./episodes/copy-paste";
import { duskMute } from "./episodes/dusk-mute";
import { duskPause } from "./episodes/dusk-pause";
import { duskGlow } from "./episodes/dusk-glow";
import { nicheWhatif } from "./episodes/niche-whatif";
import { nichePsych } from "./episodes/niche-psych";
import { nicheHorror } from "./episodes/niche-horror";
import { CastSheet } from "./CastSheet";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Dusk-Mute" component={duskMute.Main} durationInFrames={duskMute.total} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Pause" component={duskPause.Main} durationInFrames={duskPause.total} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Glow" component={duskGlow.Main} durationInFrames={duskGlow.total} fps={30} width={1920} height={1080} />
    <Composition id="Niche-WhatIf" component={nicheWhatif.Main} durationInFrames={nicheWhatif.total} fps={30} width={1920} height={1080} />
    <Composition id="Niche-Psych" component={nichePsych.Main} durationInFrames={nichePsych.total} fps={30} width={1920} height={1080} />
    <Composition id="Niche-Horror" component={nicheHorror.Main} durationInFrames={nicheHorror.total} fps={30} width={1920} height={1080} />
    <Composition id="CopyPaste" component={copyPaste.Main} durationInFrames={copyPaste.total} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Mute-Board" component={duskMute.Board} durationInFrames={duskMute.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Pause-Board" component={duskPause.Board} durationInFrames={duskPause.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Glow-Board" component={duskGlow.Board} durationInFrames={duskGlow.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Niche-WhatIf-Board" component={nicheWhatif.Board} durationInFrames={nicheWhatif.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Niche-Psych-Board" component={nichePsych.Board} durationInFrames={nichePsych.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Niche-Horror-Board" component={nicheHorror.Board} durationInFrames={nicheHorror.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Cast" component={CastSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
