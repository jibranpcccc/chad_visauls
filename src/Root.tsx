import React from "react";
import { Composition } from "remotion";
import "./engine/fonts";
import { copyPaste } from "./episodes/copy-paste";
import { duskMute } from "./episodes/dusk-mute";
import { duskPause } from "./episodes/dusk-pause";
import { duskGlow } from "./episodes/dusk-glow";
import { CastSheet } from "./CastSheet";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Dusk-Mute" component={duskMute.Main} durationInFrames={duskMute.total} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Pause" component={duskPause.Main} durationInFrames={duskPause.total} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Glow" component={duskGlow.Main} durationInFrames={duskGlow.total} fps={30} width={1920} height={1080} />
    <Composition id="CopyPaste" component={copyPaste.Main} durationInFrames={copyPaste.total} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Mute-Board" component={duskMute.Board} durationInFrames={duskMute.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Pause-Board" component={duskPause.Board} durationInFrames={duskPause.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Dusk-Glow-Board" component={duskGlow.Board} durationInFrames={duskGlow.shotCount} fps={30} width={1920} height={1080} />
    <Composition id="Cast" component={CastSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
