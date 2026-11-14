import React from "react";
import { Composition, Series } from "remotion";
import { WhatIfStickStyle } from "./styles/WhatIfStickStyle";
import { Cartoon3DToonStyle } from "./styles/Cartoon3DToonStyle";
import { RepoChadNeonStyle } from "./styles/RepoChadNeonStyle";

const AllStylesReel: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={150}>
      <WhatIfStickStyle />
    </Series.Sequence>
    <Series.Sequence durationInFrames={150}>
      <Cartoon3DToonStyle />
    </Series.Sequence>
    <Series.Sequence durationInFrames={150}>
      <RepoChadNeonStyle />
    </Series.Sequence>
  </Series>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AllStyles-Reel" component={AllStylesReel} durationInFrames={450} fps={30} width={1920} height={1080} />
    <Composition id="Style1-WhatIf-SVG" component={WhatIfStickStyle} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Style2-Cartoon3D-Toon" component={Cartoon3DToonStyle} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="Style3-RepoChad-Neon" component={RepoChadNeonStyle} durationInFrames={150} fps={30} width={1920} height={1080} />
  </>
);
