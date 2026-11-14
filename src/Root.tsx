import React from "react";
import { Composition } from "remotion";
import "./engine/fonts";
import { S1WhatIfRemember } from "./five/S1WhatIfRemember";
import { S2StorybookBees } from "./five/S2StorybookBees";
import { S3RepoChadGPS } from "./five/S3RepoChadGPS";
import { S4ByteForensicsChip } from "./five/S4ByteForensicsChip";
import { S5EditorialFlamingo } from "./five/S5EditorialFlamingo";
import { CastSheet } from "./CastSheet";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Five-S1-WhatIf" component={S1WhatIfRemember} durationInFrames={546} fps={30} width={1920} height={1080} />
    <Composition id="Five-S2-Bees" component={S2StorybookBees} durationInFrames={540} fps={30} width={1920} height={1080} />
    <Composition id="Five-S3-GPS" component={S3RepoChadGPS} durationInFrames={592} fps={30} width={1920} height={1080} />
    <Composition id="Five-S4-Silicon" component={S4ByteForensicsChip} durationInFrames={550} fps={30} width={1920} height={1080} />
    <Composition id="Five-S5-Flamingo" component={S5EditorialFlamingo} durationInFrames={539} fps={30} width={1920} height={1080} />
    <Composition id="Cast" component={CastSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
