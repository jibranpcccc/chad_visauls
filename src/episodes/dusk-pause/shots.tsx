import React from 'react';
import {
  Actor, Cat, Mug, PaperStack, CookieStack, LOOKS, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, camT,
  Foreground, FocusRings, Sparkle, Tag, Dial, TitleCard, Tabletop,
  Study, Desk, Kitchen, KitchenIsland, stand, KITCHEN, islandTop, Rooftop, Schematic, DrawOn, Arrow, SchLabel, CountUp, SCH,
  LEG_LEN, HEAD, joints, toWorld, ShotProps,
} from '../../engine';
import dialogue from './dialogue.json';
import { talkAt, naturalBlink, MouthMap } from '../dialogueHelper';

const SUIT = LOOKS.suit;
const NOVA = LOOKS.nova;
const ICE = '#7FD4FF';
const mouthFrames = dialogue.mouthFrames as MouthMap;

// ---------- Sh1: Study wide dusk — Nova urgent with reports, Suit checking watch (Narrator speaking) ----------
export const Sh1: React.FC<ShotProps> = ({ t, len }) => {
  const nova = poseAt(t, [
    { f: 0, p: { x: 780, y: 712, scale: 1.0, facing: 1, yaw: 0.45, look: 0.7, armR: { a: 95, b: 35 }, handR: 'point', tilt: 6 } },
    { f: 30, p: { armR: { a: 120, b: 20 }, tilt: 10 }, ease: easeOut },
  ]);
  const suit = poseAt(t, [
    { f: 0, p: { x: 1120, y: 712, scale: 1.0, facing: -1, yaw: -0.45, look: -0.8, armL: { a: 60, b: 70 }, armR: { a: 105, b: 40 } } },
    { f: 28, p: { armL: { a: 112, b: 60 }, headTilt: -8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 530, kf(t, [[0, 0.9], [len, 0.99]]))}>
      <Study t={t} id="p1" veil={0.34} />
      <Actor look={NOVA} pose={{ ...nova, ...faceAt(t, [[0, 'worried']]), blink: naturalBlink(t, 50, 10) }} rimId="rimR" shadow={0} />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'oops']]) }} rimId="rimL" shadow={0} />
      <Desk x0={560} x1={1360} y={700} />
      <PaperStack x={930} y={700} n={4} w={170} />
      <Mug x={1060} y={700} rot={0} f={t} />
      <Foreground blur={10}>
        <path d="M -80 1220 Q 100 840 240 850 L 340 1220 Z" fill="#120F1B" />
      </Foreground>
    </g>
  );
};

// ---------- Sh2: Macro Tabletop insert — mug tips and freezes at f67 (t=18) ----------
export const Sh2: React.FC<ShotProps> = ({ t, len }) => {
  const freezeT = Math.min(t, 18);
  const tip = easeOut(clamp(freezeT / 16)) * 52;
  const hit = t >= 18;
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Tabletop edge={680} kind="wood" />
      <g transform={`translate(960 560) rotate(${tip})`}>
        <ellipse cx={0} cy={0} rx={78} ry={40} fill="#D9D2C6" />
        <rect x={-78} y={-124} width={156} height={124} fill="#F4F1EA" />
        <path d="M -78 -68 Q 0 -30 78 -68 L 78 -42 Q 0 -4 -78 -42 Z" fill={ICE} />
        <path d="M 74 -100 Q 138 -104 130 -58 Q 122 -24 74 -32" stroke="#F4F1EA" strokeWidth={20} fill="none" />
        <ellipse cx={0} cy={-124} rx={78} ry={40} fill="#E8E2D6" />
        <ellipse cx={0} cy={-122} rx={64} ry={30} fill="#5B3A26" />
      </g>
      {[
        [1065, 440, 14],
        [1105, 485, 11],
        [1135, 530, 8],
      ].map(([dx, dy, dr], i) => (
        <circle key={i} cx={dx + clamp(freezeT / 18) * (i * 12)} cy={dy + clamp(freezeT / 18) * (i * 10)} r={dr} fill="#5B3A26" stroke={ICE} strokeWidth={hit ? 3 : 0} />
      ))}
      <FocusRings x={990} y={490} t={t - 18} r0={80} color={ICE} />
      {hit ? <Tag x={1250} y={320} t={t - 18} text="0.00x" w={170} /> : null}
    </g>
  );
};

// ---------- Sh3: Medium Study — Nova speaks (f90..f144) and freezes exact at f143 (t=54, power_down)! ----------
export const Sh3: React.FC<ShotProps> = ({ t, len, f }) => {
  const paused = t >= 54;
  const poseTime = paused ? 54 : t;
  const nova = poseAt(poseTime, [
    { f: 0, p: { x: 770, y: 712, scale: 1.18, facing: 1, yaw: 0.45, look: 0.85, armR: { a: 120, b: 30 }, tilt: 8 } },
    { f: 50, p: { armR: { a: 145, b: 18 }, tilt: 12 }, ease: easeOut },
  ]);
  const suit = poseAt(t, [
    { f: 0, p: { x: 1180, y: 712, scale: 1.18, facing: -1, yaw: -0.4, look: -0.8, armL: { a: 80, b: 70 }, handL: 'point' } },
    { f: 54, p: { armL: { a: 118, b: 40 }, headTilt: 4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), 500, kf(t, [[0, 1.12], [len, 1.19]]))}>
      <Study t={t + 89} id="p3" veil={0.36} />
      <Actor
        look={NOVA}
        pose={{ ...nova, ...faceAt(poseTime, [[0, 'worried']]), talk: paused ? 0.55 : talkAt(f, mouthFrames, 'nova') }}
        rimId="rimR"
        shadow={0}
      />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'neutral'], [54, 'smug']]) }} rimId="rimL" shadow={0} />
      <Desk x0={540} x1={1380} y={700} />
      <FocusRings x={1060} y={480} t={t - 54} r0={40} color={ICE} />
    </g>
  );
};

// ---------- Sh4: OTS over frozen Nova — Suit dons shades at f151 (t=3, shades SFX) & says "Relax. Nobody moves" ----------
export const Sh4: React.FC<ShotProps> = ({ t, len, f }) => {
  const suit = poseAt(t, [
    { f: 0, p: { x: 1100, y: 720, scale: 1.55, facing: -1, yaw: -0.35, look: -0.7, armR: { a: 100, b: 95 }, glasses: 0 } },
    { f: 8, p: { glasses: 1, armR: { a: 40, b: 45 }, tilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1050]]), 480, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-400 -180) scale(1.5)">
          <Study t={t + 148} id="p4" veil={0.35} />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#060812" opacity={0.25} />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'smug'], [8, 'cool']]), talk: talkAt(f, mouthFrames, 'suit') }} rimId="rimL" shadow={0} />
      <Foreground blur={12}>
        <path d="M -80 1220 Q 110 780 380 800 Q 560 820 650 1220 Z" fill="#111321" />
        <circle cx={330} cy={630} r={195} fill="#181A2E" />
      </Foreground>
    </g>
  );
};

// ---------- Sh5: TitleCard Kitchen — Suit finishes "...until I finish my coffee." & title_boom hits at f216 (t=20) ----------
export const Sh5: React.FC<ShotProps> = ({ t, len, f }) => {
  const s = stand(KITCHEN, 0.56, 0.44, 0.65);
  const cPos = islandTop(0.32, 0.5);
  const suit = poseAt(t, [
    { f: 0, p: { x: s.x + 60, y: s.y, scale: s.scale, facing: -1, yaw: -0.3, look: -0.5, glasses: 1, armR: { a: 52, b: 68 } } },
    { f: 26, p: { x: s.x, armR: { a: 58, b: 78 } }, ease: easeOut },
  ]);
  const j = joints(suit);
  const hand = toWorld(suit, j.armR.end);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 0.96], [len, 1.04]]))}>
      <Kitchen t={t} id="p5" veil={0.44} />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'cool']]), talk: talkAt(f, mouthFrames, 'suit') }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <CookieStack x={islandTop(0.68, 0.45).x} y={islandTop(0.68, 0.45).y} n={5} s={0.7} />
      <Cat x={cPos.x} y={cPos.y} mood="peek" f={0} />
      <Mug x={hand.x - 10} y={hand.y + 14} rot={-6} steam={0} f={0} />
      <TitleCard t={t - 2} lines={['WHAT IF ONE CLICK', 'FROZE TIME?']} accent="FROZE" accentT={18} size={92} y={170} />
    </g>
  );
};

// ---------- Sh6: Schematic beat — Frozen clock + zero friction ----------
export const Sh6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t} id="p6" />
    <Dial x={540} y={470} r={190} p={0} readout="00:00" size={84} />
    <SchLabel x={540} y={760} t={t - 4} text="WORLD CLOCK" size={40} color={SCH.dim} />
    <Arrow x0={790} y0={470} x1={960} y1={470} t={t - 8} color={SCH.line} />
    <SchLabel x={1350} y={390} t={t - 12} text="FRICTION: OFF" size={56} color={ICE} />
    <DrawOn d="M 1080 460 L 1620 460" t={t - 18} dur={10} color={SCH.dim} />
    <CountUp x={1350} y={620} t={t - 22} to={0} dur={14} size={88} suffix=".00x SPEED" />
  </g>
);

// ---------- Sh7: Dramatic Rooftop — Suit oblivious against sunset ----------
export const Sh7: React.FC<ShotProps> = ({ t, len }) => {
  const suit = poseAt(t, [
    { f: 0, p: { x: 960, y: 840 - LEG_LEN * 1.15, scale: 1.15, yaw: 0.25, look: 0.5, glasses: 1, armR: { a: 58, b: 76 } } },
    { f: 38, p: { headTilt: 5, armR: { a: 66, b: 84 } } },
  ]);
  const j = joints(suit);
  const hand = toWorld(suit, j.armR.end);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Rooftop t={t} sunX={1160} sunY={620} low={0} />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0.6} />
      <Mug x={hand.x + 8} y={hand.y + 10} rot={-6} steam={0} f={0} />
    </g>
  );
};

// ---------- Sh8: Extreme close-up Nova's eyes snap open exact on `glitch` SFX at f329 (t=6)! ----------
export const Sh8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.5 * (1 + 0.05 * clamp(t / len));
  const woke = t >= 6;
  const pose: Pose = {
    ...basePose,
    x: 960,
    y: 640 - HEAD.y * sc,
    scale: sc,
    yaw: 0.15,
    look: -0.2,
    glint: woke ? easeOut(clamp((t - 6) / 6)) : 0,
    glintColor: ICE,
    ...(woke ? { expr: 'smug' as const, blink: 0 } : { expr: 'neutral' as const, blink: 1 }),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-540 -300) scale(1.9)">
          <Study t={t + 323} id="p8" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#070812" opacity={0.3} />
      <Actor look={NOVA} pose={pose} rimId="rimL" shadow={0} />
      {woke ? <Sparkle x={1080} y={360} t={t - 6} s={1.1} /> : null}
      {woke ? <Tag x={1380} y={360} t={t - 7} text="1 AWAKE" mark="x" markT={2} w={265} /> : null}
    </g>
  );
};

// ---------- Sh9: Study two-shot — Nova confronts Suit ("Cool trick. Wait.") ----------
export const Sh9: React.FC<ShotProps> = ({ t, len, f }) => {
  const nova = poseAt(t, [
    { f: 0, p: { x: 640, y: 712, scale: 1.08, facing: 1, yaw: 0.7, look: 0.9, armR: { a: 45, b: 15 }, glint: 0.7, glintColor: ICE } },
    { f: 22, p: { x: 860, yaw: 0.5, armR: { a: 108, b: 22 }, handR: 'point' }, ease: easeOut },
  ]);
  const suit = poseAt(t, [
    { f: 0, p: { x: 1180, y: 712, scale: 1.08, facing: -1, yaw: -0.2, look: -0.2, glasses: 1, armL: { a: 105, b: 85 } } },
    { f: 22, p: { yaw: -0.65, look: -0.9, headTilt: -8, armL: { a: 72, b: 35 } }, ease: easeOut },
  ]);
  const j = joints(suit);
  const mugP = toWorld(suit, j.armL.end);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 970]]), 510, kf(t, [[0, 1.04], [len, 1.1]]))}>
      <Study t={t + 347} id="p9" veil={0.36} />
      <Actor look={NOVA} pose={{ ...nova, ...faceAt(t, [[0, 'smug']]), talk: talkAt(f, mouthFrames, 'nova') }} rimId="rimR" shadow={0} />
      <Actor look={SUIT} pose={{ ...suit, ...faceAt(t, [[0, 'cool'], [22, 'shock']]) }} rimId="rimL" shadow={0} />
      <Desk x0={520} x1={1400} y={700} />
      <Mug x={mugP.x - 10} y={mugP.y + 12} rot={4} f={t} />
    </g>
  );
};

// ---------- Sh10: Medium-close OTS from Nova grabbing mug smoothly ("Why did you steal my mug?") ----------
export const Sh10: React.FC<ShotProps> = ({ t, len, f }) => {
  const pull = easeOut(clamp((t - 4) / 14));
  const mx = lerp(1260, 940, pull);
  const nova = poseAt(t, [
    { f: 0, p: { x: 820, y: 840, scale: 1.78, facing: 1, yaw: 0.35, look: 0.65, glasses: 0, armR: { a: 84, b: 14 } } },
    { f: 18, p: { glasses: 1, armR: { a: 102, b: 78 }, headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 935]]), 480, kf(t, [[0, 1.02], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -180) scale(1.5)">
          <Study t={t + 389} id="p10" veil={0.35} />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#07050F" opacity={0.22} />
      <Actor look={NOVA} pose={{ ...nova, ...faceAt(t, [[0, 'smug'], [18, 'cool']]), talk: talkAt(f, mouthFrames, 'nova') }} rimId="rimR" shadow={0} />
      <Mug x={mx} y={610} rot={lerp(10, 0, pull)} f={t} />
      <Foreground blur={12}>
        <path d="M 1420 1220 Q 1500 820 1710 830 L 2040 1220 Z" fill="#11121A" />
        <circle cx={1700} cy={660} r={185} fill="#171923" />
      </Foreground>
    </g>
  );
};

// ---------- Sh11: Suit shocked medium-close reaction ("How are you still moving?!") ----------
export const Sh11: React.FC<ShotProps> = ({ t, len, f }) => {
  const sc = 2.75 * (1 + 0.05 * clamp(t / len));
  const suit: Pose = {
    ...basePose,
    x: 960,
    y: 660 - HEAD.y * sc,
    scale: sc,
    yaw: -0.15,
    look: -0.6,
    armL: { a: 125, b: 40 },
    armR: { a: 125, b: 40 },
    headTilt: kf(t, [[0, -6], [10, 4]]),
    ...faceAt(t, [[0, 'shock']]),
    talk: talkAt(f, mouthFrames, 'suit'),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-480 -220) scale(1.8)">
          <Study t={t + 421} id="p11" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#080612" opacity={0.28} />
      <Actor look={SUIT} pose={suit} rimId="rimRed" shadow={0} />
    </g>
  );
};
