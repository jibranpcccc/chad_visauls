import React from "react";
import { Composition } from "remotion";
import "./engine/fonts";
import { copyPaste } from "./episodes/copy-paste";
import { pauseEveryone } from "./episodes/pause-everyone";
import { CastSheet } from "./CastSheet";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id={pauseEveryone.id} component={pauseEveryone.Main} durationInFrames={Math.max(1, pauseEveryone.total)} fps={30} width={1920} height={1080} />
    <Composition id={copyPaste.id} component={copyPaste.Main} durationInFrames={Math.max(1, copyPaste.total)} fps={30} width={1920} height={1080} />
    <Composition id="Cast" component={CastSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
