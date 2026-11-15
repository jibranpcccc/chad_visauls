import React from 'react';
import {
  Actor, Mug, PaperStack, LOOKS, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT,
  Foreground, FocusRings, Sparkle, Tag, Gauge, TitleCard,
  Study, Desk, Schematic, SchLabel, SCH,
  HEAD, ShotProps,
} from '../../engine';
import dialogue from './dialogue.json';
import { talkAt, naturalBlink, MouthMap } from '../dialogueHelper';

const SUIT = LOOKS.suit;
const NOVA = LOOKS.nova;
const ICE = '#7FD4FF';
const mouthFrames = dialogue.mouthFrames as MouthMap;

// ---------- Sh1: Study wide — Suit fuming at desk, Nova calm on left ----------
export const Sh1: React.FC<ShotProps> = ({ t, len }) => {
  const suit = poseAt(t, [
    { f: 0, p: { x: 1140, y: 712, scale: 1.0, facing: -1, yaw: -0.45, look: -0.8, armL: { a: 105, b: 30 }, handL: 'point' } },
    { f: 40, p: { armL: { a: 132, b: 18 }, tilt: -8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 530, kf(t, [[0, 0.92], [len, 1.0]]))}>
      <Study t={t} id="ps1" veil={0.34} />
      <Actor look={NOVA} pose={{ ...basePose, x: 760, y: 712, scale: 1.0, facing: 1, yaw: 0.4, look: 0.7, armR: { a: 45, b: -30 }, ...faceAt(t, [[0, 'neutral']]), blink: naturalBlink(t, 48, 12) }} rimId="rimR" shadow={0} />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'smug'], [36, 'shock']]) }} rimId="rimL" shadow={0} />
      <Desk x0={560} x1={1360} y={700} />
      <PaperStack x={960} y={700} n={5} w={175} />
      <Mug x={790} y={700} rot={0} f={t} />
    </g>
  );
};

// ---------- Sh2: OTS onto Suit yelling ("Your report is late and totally useless!") ----------
export const Sh2: React.FC<ShotProps> = ({ t, len, f }) => {
  const suit = poseAt(t, [
    { f: 0, p: { x: 1080, y: 880, scale: 1.72, facing: -1, yaw: -0.35, look: -0.75, armL: { a: 115, b: 25 }, handL: 'point' } },
    { f: 30, p: { armL: { a: 135, b: 16 }, tilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1040]]), 490, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -180) scale(1.45)">
          <Study t={t + 80} id="ps2" veil={0.35} />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#080612" opacity={0.22} />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'shock']]), talk: talkAt(f, mouthFrames, 'suit') }} rimId="rimRed" shadow={0} />
      <Foreground blur={12}>
        <path d="M -80 1220 Q 110 780 380 800 Q 560 820 650 1220 Z" fill="#111321" />
        <circle cx={330} cy={630} r={195} fill="#181A2E" />
      </Foreground>
    </g>
  );
};

// ---------- Sh3: Medium-close Nova calm echo ("Totally useless?") ----------
export const Sh3: React.FC<ShotProps> = ({ t, len, f }) => {
  const nova: Pose = {
    ...basePose,
    x: 880,
    y: 920,
    scale: 1.82,
    facing: 1,
    yaw: 0.25,
    look: 0.5,
    headTilt: kf(t, [[0, 0], [14, -6]]),
    armL: { a: 45, b: -40 },
    armR: { a: 45, b: -40 },
    glint: 0.65,
    glintColor: ICE,
    ...faceAt(t, [[0, 'cool']]),
    talk: talkAt(f, mouthFrames, 'nova'),
  };
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -180) scale(1.45)">
          <Study t={t + 145} id="ps3" veil={0.36} />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#070814" opacity={0.24} />
      <Actor look={NOVA} pose={nova} rimId="rimR" shadow={0} />
      <FocusRings x={880} y={440} t={t - 2} r0={75} color={ICE} />
      <Tag x={1370} y={360} t={t - 2} text="MIRROR: 3 WORDS" mark="check" markT={2} w={460} />
    </g>
  );
};

// ---------- Sh4: TitleCard Study — "Repeat their last three words." ----------
export const Sh4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 0.98], [len, 1.05]]))}>
    <Study t={t + 175} id="ps4" veil={0.38} />
    <Actor look={NOVA} pose={{ ...basePose, x: 760, y: 712, scale: 1.0, facing: 1, yaw: 0.4, look: 0.7, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
    <Actor look={SUIT} pose={{ ...basePose, x: 1140, y: 712, scale: 1.0, facing: -1, yaw: -0.45, look: -0.8, armL: { a: 118, b: 20 }, ...faceAt(t, [[0, 'oops']]) }} rimId="rimL" shadow={0} />
    <Desk x0={560} x1={1360} y={700} />
    <TitleCard t={t - 2} lines={['THE 3-WORD', 'MIRROR HACK']} accent="MIRROR" accentT={3} size={92} y={175} />
  </g>
);

// ---------- Sh5: Schematic HUD — "Watch their brain freeze." exact power_down at f255 (t=30) ----------
export const Sh5: React.FC<ShotProps> = ({ t, len }) => {
  const p = 1 - easeOut(clamp(t / 30));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t} id="ps5" />
      <SchLabel x={960} y={240} t={t - 2} text="PSYCHOLOGY OVERRIDE" size={48} color={SCH.dim} />
      <Gauge x={460} y={440} w={1000} p={p} label="HOSTILITY LEVEL" danger={0.6} />
      <Tag x={960} y={730} t={t - 26} text="BRAIN FREEZE" mark="check" markT={4} w={330} />
    </g>
  );
};

// ---------- Sh6: Medium-close Suit stammering ("Well, I mean, the font was actually okay.") ----------
export const Sh6: React.FC<ShotProps> = ({ t, len, f }) => {
  const suit = poseAt(t, [
    { f: 0, p: { x: 960, y: 920, scale: 1.8, facing: -1, yaw: -0.25, look: -0.5, armL: { a: 72, b: 42 }, armR: { a: 72, b: 42 } } },
    { f: 36, p: { headTilt: -6, armL: { a: 86, b: 26 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -180) scale(1.45)">
          <Study t={t + 270} id="ps6" veil={0.36} />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#080612" opacity={0.24} />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'oops'], [34, 'worried']]), talk: talkAt(f, mouthFrames, 'suit') }} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- Sh7: Medium-close Nova dons shades ("Thought so.") ----------
export const Sh7: React.FC<ShotProps> = ({ t, len, f }) => {
  const sc = 2.55 * (1 + 0.04 * clamp(t / len));
  const nova: Pose = {
    ...basePose,
    x: 960,
    y: 660 - HEAD.y * sc,
    scale: sc,
    yaw: 0.15,
    look: -0.2,
    glasses: t >= 1 ? 1 : 0,
    armR: { a: t < 10 ? 96 : 36, b: t < 10 ? 88 : 36 },
    ...faceAt(t, [[0, 'smug'], [4, 'cool']]),
    talk: talkAt(f, mouthFrames, 'nova'),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-480 -220) scale(1.8)">
          <Study t={t + 343} id="ps7" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#070812" opacity={0.28} />
      <Actor look={NOVA} pose={nova} rimId="rimR" shadow={0} />
      <Sparkle x={1120} y={320} t={t - 16} s={1.3} />
    </g>
  );
};
