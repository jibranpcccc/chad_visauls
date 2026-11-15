import React from 'react';
import {
  Actor, Cat, Mug, Plate, LOOKS, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, camT,
  FocusRings, Sparkle, Tag, Dial, TitleCard,
  Kitchen, KitchenIsland, stand, KITCHEN, islandTop, Schematic, SchLabel, CountUp, SCH,
  HEAD, FONT, UI, ShotProps,
} from '../../engine';
import dialogue from './dialogue.json';
import { talkAt, naturalBlink, MouthMap } from '../dialogueHelper';

const PIP = LOOKS.pip;
const MOM = LOOKS.mom;
const CYAN = '#7FD4FF';
const CORAL = '#FF6F61';
const mouthFrames = dialogue.mouthFrames as MouthMap;

// ---------- Sh1: Kitchen wide — Pip clumsily reaching across island ----------
export const Sh1: React.FC<ShotProps> = ({ t, len }) => {
  const m = stand(KITCHEN, 0.34, 0.44, 0.65);
  const p = stand(KITCHEN, 0.64, 0.44, 0.65);
  const mug = islandTop(0.5, 0.5);
  const pip = poseAt(t, [
    { f: 0, p: { x: p.x, y: p.y, scale: p.scale, facing: -1, yaw: -0.35, look: -0.6, armL: { a: 70, b: 30 } } },
    { f: 32, p: { armL: { a: 122, b: 18 }, tilt: -8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 0.96], [len, 1.04]]))}>
      <Kitchen t={t} id="wi1" veil={0.4} />
      <Actor look={MOM} pose={{ ...basePose, x: m.x, y: m.y, scale: m.scale, yaw: 0.3, look: 0.6, armR: { a: 50, b: -50 }, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <Actor look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]), blink: naturalBlink(t, 45, 10) }} rimId="rimL" shadow={0} />
      <KitchenIsland />
      <Mug x={mug.x} y={mug.y} rot={kf(t, [[0, 0], [38, 16]])} f={t} />
      <Cat x={islandTop(0.38, 0.5).x} y={islandTop(0.38, 0.5).y} mood="alert" f={t} />
    </g>
  );
};

// ---------- Sh2: Macro UI preview — REWIND -5s pill hovering ready ----------
export const Sh2: React.FC<ShotProps> = ({ t, len }) => {
  const hover = Math.sin(t * 0.28) * 10;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.98], [len, 1.06]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -220) scale(1.6)">
          <Kitchen t={t + 42} id="wi2bg" veil={0.42} />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#080612" opacity={0.48} />
      <g transform="translate(960 470)">
        <rect x={-310} y={-88} width={620} height={176} rx={88} fill={UI.pill} stroke={CYAN} strokeWidth={6} opacity={0.92} />
        <text x={-225} y={14} fontFamily={FONT.ui} fontSize={42} fill={UI.text} letterSpacing={4}>
          REWIND: -5s
        </text>
        <circle cx={210} cy={0} r={54} fill={CYAN} />
      </g>
      <FocusRings x={1170} y={470} t={t} r0={56} color={CYAN} />
      <g transform={`translate(1185 ${730 + hover})`} filter="url(#rimR)">
        <path d="M 35 360 Q 10 150 -8 0" stroke={PIP.line} strokeWidth={104} fill="none" strokeLinecap="round" />
        <path d="M 35 360 Q 10 150 -8 0" stroke={PIP.hand} strokeWidth={86} fill="none" strokeLinecap="round" />
        <ellipse cx={-8} cy={-4} rx={36} ry={48} fill={PIP.hand} stroke={PIP.line} strokeWidth={8} />
      </g>
    </g>
  );
};

// ---------- Sh3: Medium-close Pip panicking ("Oops, sorry!") at shatter f87 ----------
export const Sh3: React.FC<ShotProps> = ({ t, len, f }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: 960, y: 920, scale: 1.78, facing: -1, yaw: -0.2, look: -0.4, armL: { a: 132, b: 22 }, armR: { a: 132, b: 22 } } },
    { f: 16, p: { tilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -180) scale(1.45)">
          <Kitchen t={t + 85} id="wi3" veil={0.4} />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#080612" opacity={0.22} />
      <Actor look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'shock']]), talk: talkAt(f, mouthFrames, 'pip') }} rimId="rimRed" shadow={0} />
      <Plate x={740} y={620} s={0.8} />
      <Tag x={1340} y={350} t={t} text="SHATTERED" mark="x" markT={1} w={250} />
    </g>
  );
};

// ---------- Sh4: Macro UI slam REWIND ("Rewind!") exact at f107 (t=1)! ----------
export const Sh4: React.FC<ShotProps> = ({ t, len }) => {
  const tap = clamp(t / 5);
  const tapY = Math.sin(tap * Math.PI) * 34;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.02], [len, 1.12]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -220) scale(1.6)">
          <Kitchen t={t + 106} id="wi4bg" veil={0.42} />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#050814" opacity={0.5} />
      <g transform="translate(960 470)">
        <rect x={-310} y={-88} width={620} height={176} rx={88} fill={UI.pill} stroke={CYAN} strokeWidth={8} />
        <text x={-225} y={14} fontFamily={FONT.ui} fontSize={42} fill={CYAN} letterSpacing={4}>
          REWINDING...
        </text>
        <circle cx={210} cy={0} r={54} fill={CYAN} />
      </g>
      <FocusRings x={1170} y={470} t={t - 1} r0={62} color={CYAN} />
      <g transform={`translate(1185 ${710 - tapY})`} filter="url(#rimR)">
        <path d="M 35 360 Q 10 150 -8 0" stroke={PIP.line} strokeWidth={104} fill="none" strokeLinecap="round" />
        <path d="M 35 360 Q 10 150 -8 0" stroke={PIP.hand} strokeWidth={86} fill="none" strokeLinecap="round" />
        <ellipse cx={-8} cy={-4} rx={36} ry={48} fill={PIP.hand} stroke={PIP.line} strokeWidth={8} />
      </g>
    </g>
  );
};

// ---------- Sh5: TitleCard Kitchen restored — "Zero mess. Zero blame." ----------
export const Sh5: React.FC<ShotProps> = ({ t, len }) => {
  const p = stand(KITCHEN, 0.5, 0.42, 0.65);
  const mug = islandTop(0.62, 0.45);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 0.98], [len, 1.05]]))}>
      <Kitchen t={t} id="wi5" veil={0.42} />
      <Actor look={PIP} pose={{ ...basePose, x: p.x, y: p.y, scale: p.scale, yaw: 0.2, look: 0.2, glasses: 1, armR: { a: 45, b: 55 }, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Mug x={mug.x} y={mug.y} rot={0} f={t} />
      <Sparkle x={mug.x + 50} y={mug.y - 40} t={t - 6} s={1.1} />
      <TitleCard t={t - 2} lines={['WHAT IF YOU COULD', 'REWIND 5 SECONDS?']} accent="REWIND" accentT={2} size={90} y={170} />
    </g>
  );
};

// ---------- Sh6: Schematic loop overload ("Until you spam it.") ----------
export const Sh6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t} id="wi6" />
    <Dial x={540} y={470} r={185} p={1 - clamp(t / 28)} readout="-05:00" size={78} />
    <SchLabel x={540} y={760} t={t - 2} text="TIMELINE BUFFER" size={40} color={SCH.dim} />
    <CountUp x={1340} y={480} t={t - 4} to={99} dur={22} size={118} suffix="x" color={CORAL} />
    <Tag x={1340} y={660} t={t - 20} text="LOOP OVERLOAD" mark="x" markT={2} w={340} />
  </g>
);

// ---------- Sh7: Kitchen two-shot — Mum points at floating backward Cat ("Pip, why is the cat floating backward?") ----------
export const Sh7: React.FC<ShotProps> = ({ t, len, f }) => {
  const m = stand(KITCHEN, 0.34, 0.44, 0.65);
  const p = stand(KITCHEN, 0.68, 0.44, 0.65);
  const catBase = islandTop(0.5, 0.5);
  const floatY = catBase.y - 125 + Math.sin(t * 0.35) * 18;
  const floatX = catBase.x + Math.sin(t * 0.15) * 24;
  return (
    <g transform={camT(960, 520, kf(t, [[0, 0.98], [len, 1.05]]))}>
      <Kitchen t={t + 215} id="wi7" veil={0.38} />
      <Actor look={MOM} pose={{ ...basePose, x: m.x, y: m.y, scale: m.scale, facing: 1, yaw: 0.4, look: 0.7, armR: { a: 112, b: 18 }, handR: 'point', ...faceAt(t, [[0, 'worried']]), talk: talkAt(f, mouthFrames, 'mom') }} rimId="rimR" shadow={0} />
      <Actor look={PIP} pose={{ ...basePose, x: p.x, y: p.y, scale: p.scale, facing: -1, yaw: -0.35, look: -0.7, armL: { a: 80, b: 40 }, ...faceAt(t, [[0, 'oops']]) }} rimId="rimL" shadow={0} />
      <KitchenIsland />
      <g transform={`translate(${floatX} ${floatY}) rotate(180)`}>
        <Cat x={0} y={0} mood="alert" f={t} />
      </g>
      <FocusRings x={floatX} y={floatY} t={t - 10} r0={65} color={CYAN} />
    </g>
  );
};

// ---------- Sh8: Medium-close Pip reaction ("Wait, is that a physics glitch?") ----------
export const Sh8: React.FC<ShotProps> = ({ t, len, f }) => {
  const sc = 2.65 * (1 + 0.04 * clamp(t / len));
  const pip: Pose = {
    ...basePose,
    x: 960,
    y: 660 - HEAD.y * sc,
    scale: sc,
    yaw: -0.15,
    look: -0.45,
    armL: { a: 98, b: 32 },
    armR: { a: 98, b: 32 },
    headTilt: kf(t, [[0, -5], [40, 4]]),
    ...faceAt(t, [[0, 'oops'], [43, 'shock']]),
    talk: talkAt(f, mouthFrames, 'pip'),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-480 -220) scale(1.8)">
          <Kitchen t={t + 276} id="wi8" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#080612" opacity={0.28} />
      <Actor look={PIP} pose={pip} rimId="rimL" shadow={0} />
    </g>
  );
};
