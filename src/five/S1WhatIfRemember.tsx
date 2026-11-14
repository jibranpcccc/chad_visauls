import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  Hero, Pose, basePose, poseAt, kf, easeOut, camT, LOOKS,
  Study, Desk, STUDY, Kitchen, KitchenIsland, KITCHEN, stand,
  Rooftop, Schematic, Arrow, SchLabel, CountUp,
  PaperStack, Foreground, LightVeil, Sparkle, TitleCard, HudChip,
  KitDefs, SetDefs,
} from "../engine";
import { WordSubtitles, WordTiming } from "../components/WordSubtitles";
import wordsData from "../data/five_s1_words.json";

const words = wordsData as WordTiming[];
const P = (o: Partial<Pose>): Pose => ({ ...basePose, ...o });

const Beat1Study: React.FC = () => {
  const t = useCurrentFrame();
  const pPos = stand(STUDY, 0.45, 0.56);
  const mPos = stand(STUDY, 0.72, 0.56);
  const pipPose = poseAt(t, [
    { f: 0, p: { x: pPos.x, y: pPos.y, scale: pPos.scale, yaw: 0.3, armR: { a: 40, b: 10 }, expr: "neutral" } },
    { f: 28, p: { armR: { a: 90, b: 25 }, handR: "point", expr: "happy" }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 550, kf(t, [[0, 1.2], [108, 1.32]]))}>
      <Study t={t} id="f1_st" />
      <Hero look={LOOKS.pipHood} pose={pipPose} shadow={0.6} />
      <Hero look={LOOKS.mo} pose={P({ x: mPos.x, y: mPos.y, scale: mPos.scale, yaw: -0.4, expr: "shock" })} shadow={0.6} />
      <Desk x0={420} x1={1500} y={760} laptop lamp />
      <PaperStack x={830} y={620} n={Math.min(11, Math.floor(t / 10) + 2)} />
      <LightVeil id="f1_v1" lights={[[960, 420, 720]]} o={0.35} />
    </g>
  );
};

const Beat2Kitchen: React.FC = () => {
  const t = useCurrentFrame();
  const mom = stand(KITCHEN, 0.25, 0.5);
  const sis = stand(KITCHEN, 0.42, 0.52);
  const pip = stand(KITCHEN, 0.68, 0.54);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.16], [111, 1.28]]))}>
      <Kitchen t={t} id="f1_k1" />
      <Hero look={LOOKS.mom} pose={P({ x: mom.x, y: mom.y, scale: 0.78, yaw: 0.45, expr: "worried" })} shadow={0.6} />
      <Hero look={LOOKS.sis} pose={P({ x: sis.x, y: sis.y + 30, scale: 0.7, yaw: 0.4, armR: { a: 95, b: 10 }, expr: "shock" })} shadow={0.6} />
      <Hero look={LOOKS.pipHood} pose={P({ x: pip.x, y: pip.y, scale: 0.82, yaw: -0.4, armR: { a: 90, b: -5 }, handR: "point", expr: "smug" })} shadow={0.6} />
      <KitchenIsland />
      <Foreground blur={8}><path d="M 1340 1000 Q 1400 780 1540 740 Q 1470 860 1460 1000 Z" fill="#0E1610" /></Foreground>
    </g>
  );
};

const Beat3Title: React.FC = () => {
  const t = useCurrentFrame();
  return <TitleCard t={t} lines={["WHAT IF YOU REMEMBERED", "EVERY SINGLE SECOND?"]} accent="#7FD4FF" />;
};

const Beat4Rooftop: React.FC = () => {
  const t = useCurrentFrame();
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 1140, y: 760, scale: 0.85, yaw: -0.35, armL: { a: 30, b: 20 }, armR: { a: 30, b: 20 }, expr: "worried" } },
    { f: 45, p: { armL: { a: 60, b: 70 }, armR: { a: 60, b: 70 }, expr: "shock" }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.12], [121, 1.22]]))}>
      <Rooftop t={t} />
      <Hero look={LOOKS.mo} pose={P({ x: 640, y: 760, scale: 0.84, yaw: 0.4, armL: { a: 135, b: 20 }, armR: { a: 135, b: 20 }, expr: "happy" })} shadow={0.7} />
      <Hero look={LOOKS.pipHood} pose={pipPose} shadow={0.7} />
      <Sparkle x={640} y={460} t={t - 10} />
    </g>
  );
};

const Beat5Schematic: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <g>
      <Schematic t={t} />
      <Hero look={LOOKS.suit} pose={P({ x: 350, y: 750, scale: 0.78, yaw: 0.45, expr: "neutral" })} shadow={0.5} />
      <Hero look={LOOKS.pipHood} pose={P({ x: 1570, y: 750, scale: 0.8, yaw: -0.45, expr: "oops" })} shadow={0.5} />
      <SchLabel x={960} y={240} t={t} text="FORGETTING = BRAIN CLEANUP" size={52} color="#7FD4FF" />
      <Arrow x0={560} y0={480} x1={1360} y1={480} t={t - 12} color="#FFD27D" />
      <CountUp x={960} y={660} t={t - 15} to={100} suffix="% SANE" size={80} />
    </g>
  );
};

export const S1WhatIfRemember: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#14101C", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Audio src={staticFile("five/s1_master.wav")} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <KitDefs />
        <SetDefs />
        <Sequence from={0} durationInFrames={108} layout="none"><Beat1Study /></Sequence>
        <Sequence from={108} durationInFrames={111} layout="none"><Beat2Kitchen /></Sequence>
        <Sequence from={219} durationInFrames={74} layout="none"><Beat3Title /></Sequence>
        <Sequence from={293} durationInFrames={121} layout="none"><Beat4Rooftop /></Sequence>
        <Sequence from={414} durationInFrames={132} layout="none"><Beat5Schematic /></Sequence>
        <g transform="translate(48, 36)"><HudChip f={frame} label="100% RECALL" icon="copy" /></g>
      </svg>
      <WordSubtitles words={words} accentColor="#7FD4FF" bottom={44} />
    </AbsoluteFill>
  );
};
