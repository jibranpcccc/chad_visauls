import React from 'react';
import {
  Actor, Mug, LOOKS, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, settle, camT,
  Foreground, FocusRings, Sparkle, Tag, Marquee, DizzyStars, TitleCard,
  Classroom, SchoolDesk, CLS, Bedroom, bedSit, BedDuvet, Stairwell, Banister, hipGround, walkPose, Kitchen, KitchenIsland, stand, KITCHEN, islandTop,
  Glow, LEG_LEN, HEAD, FONT, UI, ShotProps,
} from '../../engine';
import dialogue from './dialogue.json';
import { talkAt, naturalBlink, MouthMap } from '../dialogueHelper';

const MO = LOOKS.mo;
const SIS = LOOKS.sis;
const CORAL = '#FF6F61';
const CYAN = '#7FD4FF';
const mouthFrames = dialogue.mouthFrames as MouthMap;

// ---------- Sh1: Classroom dusk wide — Sister gesturing wildly, Mo plugging ears (Narrator speaking) ----------
export const Sh1: React.FC<ShotProps> = ({ t, len }) => {
  const chatter = Math.sin(t * 0.75) * 16;
  const mo = poseAt(t, [
    { f: 0, p: { x: 870, y: 740, scale: 1.05, yaw: 0.25, look: -0.5, armL: { a: 156, b: -130 }, armR: { a: 156, b: -130 }, headTilt: -6 } },
    { f: 20, p: { headTilt: -12, tilt: -5 } },
    { f: 40, p: { headTilt: -8, tilt: -3 } },
  ]);
  const sisSt = stand(CLS, 0.74, 0.56, 0.62);
  const sis = poseAt(t, [
    { f: 0, p: { x: sisSt.x, y: sisSt.y, scale: sisSt.scale * 0.74, facing: -1, yaw: -0.75, look: -0.9, armL: { a: 105 + chatter, b: 25 }, armR: { a: 60 - chatter, b: 30 }, tilt: -6, handL: 'point' } },
    { f: 22, p: { tilt: -10, headTilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 540, kf(t, [[0, 0.94], [len, 1.04]]))}>
      <Classroom t={t} id="mute1" />
      <Actor look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'worried']]), blink: naturalBlink(t, 40, 12) }} rimId="rimR" shadow={0} />
      <SchoolDesk x={870} />
      <Actor look={SIS} pose={{ ...sis, armL: { a: 105 + chatter, b: 25 }, armR: { a: 60 - chatter, b: 30 }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.6} />
      <Foreground blur={9}>
        <path d="M -80 1200 Q 40 820 190 830 Q 310 840 360 1200 Z" fill="#13101B" />
        <circle cx={150} cy={715} r={108} fill="#171321" />
      </Foreground>
    </g>
  );
};

// ---------- Sh2: Macro UI click — finger activates MUTE toggle ----------
export const Sh2: React.FC<ShotProps> = ({ t, len }) => {
  const clicked = clamp((t - 18) / 5);
  const kx = lerp(1070, 1185, easeOut(clicked));
  const tapY = t >= 15 && t < 24 ? Math.sin(((t - 15) / 9) * Math.PI) * 32 : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.98], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-400 -240) scale(1.6)">
          <Classroom t={t + 46} id="mute2bg" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#080612" opacity={0.48} />
      <g transform="translate(960 470)">
        <rect x={-310} y={-88} width={620} height={176} rx={88} fill={UI.pill} stroke={clicked > 0.5 ? CORAL : CYAN} strokeWidth={6} opacity={0.92} />
        <text x={-255} y={14} fontFamily={FONT.ui} fontSize={40} fill={UI.text} letterSpacing={4}>
          {clicked > 0.5 ? 'VOICE: OFF' : 'VOICE: 100%'}
        </text>
        <circle cx={kx - 960} cy={0} r={56} fill={clicked > 0.5 ? CORAL : CYAN} />
        {clicked > 0.5 ? (
          <path d={`M ${kx - 982} -20 L ${kx - 938} 20 M ${kx - 938} -20 L ${kx - 982} 20`} stroke="#0B0816" strokeWidth={10} strokeLinecap="round" />
        ) : null}
      </g>
      <FocusRings x={1185} y={470} t={t - 18} r0={58} color={CORAL} />
      <g transform={`translate(${kx + 18} ${730 - tapY})`} filter="url(#rimR)">
        <path d="M 35 360 Q 10 150 -8 0" stroke={MO.line} strokeWidth={104} fill="none" strokeLinecap="round" />
        <path d="M 35 360 Q 10 150 -8 0" stroke={MO.hand} strokeWidth={86} fill="none" strokeLinecap="round" />
        <ellipse cx={-8} cy={-4} rx={36} ry={48} fill={MO.hand} stroke={MO.line} strokeWidth={8} />
      </g>
    </g>
  );
};

// ---------- Sh3: OTS over Mo's shoulder onto Sister; muted snap exact at f140 (t=58)! ----------
export const Sh3: React.FC<ShotProps> = ({ t, len, f }) => {
  const isMuted = t >= 58;
  const wave = Math.sin(t * 0.95) * (isMuted ? 10 : 14);
  const sisPose = poseAt(t, [
    { f: 0, p: { x: 1120, y: 760, scale: 1.9, facing: -1, yaw: -0.55, look: -0.8, armL: { a: 120, b: 35 }, armR: { a: 45, b: 20 }, handL: 'point' } },
    { f: 58, p: { armL: { a: 138, b: 18 }, tilt: -6 }, ease: easeOut },
  ]);
  const ex = faceAt(t, [[0, 'happy'], [58, 'shock']]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1050]]), 510, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -180) scale(1.45)">
          <Classroom t={t + 82} id="mute3" />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#07050E" opacity={0.22} />
      <Actor
        look={SIS}
        pose={{ ...sisPose, ...ex, armL: { a: 120 + wave, b: 30 }, talk: isMuted ? 0 : talkAt(f, mouthFrames, 'sis') }}
        rimId="rimL"
        shadow={0}
      />
      <Marquee x={890} y={240} w={450} h={490} t={t - 50} color={isMuted ? CORAL : CYAN} label={isMuted ? 'MUTED' : undefined} />
      {isMuted ? <Tag x={1515} y={325} t={t - 58} text="0 dB" mark="x" markT={1} w={175} /> : null}
      <Foreground blur={12}>
        <path d="M -80 1220 Q 120 790 360 800 Q 560 810 660 1220 Z" fill="#120F1B" />
        <circle cx={320} cy={650} r={195} fill="#181423" />
        <path d="M 300 455 Q 405 470 420 620" stroke="#E06A5A" strokeWidth={18} fill="none" strokeLinecap="round" />
        <rect x={392} y={592} width={52} height={96} rx={22} fill="#E06A5A" />
      </Foreground>
    </g>
  );
};

// ---------- Sh4: TitleCard wide in Kitchen — Mo dons shades at f149 (t=2), title_boom at f196 (t=49) ----------
export const Sh4: React.FC<ShotProps> = ({ t, len, f }) => {
  const m = stand(KITCHEN, 0.5, 0.42, 0.65);
  const mug = islandTop(0.62, 0.45);
  const moPose = poseAt(t, [
    { f: 0, p: { x: m.x, y: m.y, scale: m.scale, yaw: 0.2, look: 0.2, glasses: 0, armR: { a: 28, b: 20 } } },
    { f: 4, p: { glasses: 1, armR: { a: 96, b: 96 }, headTilt: -5 }, ease: easeOut },
    { f: 28, p: { glasses: 1, armR: { a: 36, b: 36 }, headTilt: -3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 540]]), kf(t, [[0, 0.98], [len, 1.05]]))}>
      <Kitchen t={t} id="mute4" veil={0.44} />
      <Actor look={MO} pose={{ ...moPose, ...faceAt(t, [[0, 'smug'], [6, 'cool']]), talk: talkAt(f, mouthFrames, 'mo') }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Mug x={mug.x} y={mug.y} rot={0} f={t} />
      <TitleCard t={t - 8} lines={['WHAT IF YOU COULD', 'MUTE ANYONE?']} accent="ANYONE" accentT={41} size={92} y={175} />
    </g>
  );
};

// ---------- Sh5: Bedroom two-shot — Sister silently blocked by MUTED tag (Narrator speaking) ----------
export const Sh5: React.FC<ShotProps> = ({ t, len }) => {
  const wave = Math.sin(t * 0.85) * 18;
  const bs = bedSit(0.24);
  const mo = poseAt(t, [
    { f: 0, p: { x: bs.x, y: bs.y, scale: bs.scale, facing: 1, yaw: 0.35, look: -0.6, glasses: 1, armR: { a: 45, b: 40 }, headTilt: 4 } },
    { f: 30, p: { armL: { a: 120, b: 18 }, tilt: 6 }, ease: easeOut },
  ]);
  const sis = poseAt(t, [
    { f: 0, p: { x: 1180, y: 740, scale: 0.78, facing: -1, yaw: -0.8, look: -1, tilt: -10, handL: 'point', armL: { a: 132 + wave, b: 18 }, armR: { a: 72, b: 35 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 920], [len, 945]]), 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Bedroom t={t} id="mute5" duvet={false} clock="06:42" />
      <Actor look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
      <BedDuvet knees={0.7} />
      <Actor look={SIS} pose={{ ...sis, armL: { a: 132 + wave, b: 18 }, ...faceAt(t, [[0, 'worried']]) }} rimId="rimL" shadow={0.7} />
      <Tag x={1410} y={435} t={t} text="MUTED" mark="x" markT={0} w={210} />
    </g>
  );
};

// ---------- Sh6: Stairwell wide — Mo strolling down casually ----------
export const Sh6: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(610, 860, t / len);
  const mo = walkPose(x, t * 0.45, hipGround, 0.92, { glasses: 1, look: 0.4, headTilt: -5 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 960]]), kf(t, [[0, 500], [len, 560]]), kf(t, [[0, 0.96], [len, 1.04]]))}>
      <Stairwell t={t} id="mute6" />
      <Actor look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'cool']]) }} rimId="rimL" shadow={0.7} />
      <Banister />
      <Glow x={1020} y={845} r={110} kind="warm" o={0.22 + 0.12 * Math.sin(t * 0.6)} />
    </g>
  );
};

// ---------- Sh7: Close-up Sister warning wildly on landing ----------
export const Sh7: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.5 * (1 + 0.04 * clamp(t / len));
  const wv = Math.sin(t * 1.1) * 20;
  const sis: Pose = {
    ...basePose,
    x: 880,
    y: 520 - HEAD.y * sc,
    scale: sc,
    yaw: 0.45,
    look: 0.9,
    tilt: 8,
    armR: { a: 135 + wv, b: 20 },
    armL: { a: 110 - wv, b: 30 },
    ...faceAt(t, [[0, 'shock']]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-320 -150) scale(1.7)">
          <Stairwell t={t + 44} id="mute7" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#090612" opacity={0.25} />
      <Actor look={SIS} pose={sis} rimId="rimRed" shadow={0} />
      <Tag x={1360} y={360} t={t} text="MUTED" mark="x" markT={0} w={180} />
    </g>
  );
};

// ---------- Sh8: Stairwell slip! Muffled warning ("Mo! Watch out, loose step!" f358..f434), Mo slips at end ----------
export const Sh8: React.FC<ShotProps> = ({ t, len, f }) => {
  const slip = easeOut(clamp((t - 50) / 18));
  const moX = lerp(900, 1140, t / len);
  const moY = hipGround(moX) - LEG_LEN * 0.92 - Math.sin(slip * Math.PI) * 95;
  const mo = poseAt(t, [
    { f: 0, p: { x: moX, y: hipGround(moX) - LEG_LEN * 0.92, scale: 0.92, facing: 1, yaw: 0.8, glasses: 1 } },
    { f: 50, p: { spin: 0, armL: { a: 25, b: 15 }, armR: { a: 25, b: 15 } } },
    { f: 68, p: { spin: -78, tilt: -22, glasses: 0, legL: { a: 55, b: 10 }, legR: { a: -20, b: -35 }, armL: { a: 150, b: 20 }, armR: { a: 140, b: 35 } }, ease: easeOut },
  ]);
  const sis: Pose = {
    ...basePose,
    x: 470,
    y: 420 - LEG_LEN * 0.72,
    scale: 0.72,
    facing: 1,
    yaw: 0.7,
    look: 1,
    tilt: 12,
    armR: { a: 130, b: 10 },
    handR: 'point',
    ...faceAt(t, [[0, 'shock']]),
    talk: talkAt(f, mouthFrames, 'sis'),
  };
  return (
    <g transform={camT(kf(t, [[0, 920], [len, 1020]]), kf(t, [[0, 560], [len, 630]]), kf(t, [[0, 1.05], [len, 1.15]]))}>
      <Stairwell t={t + 80} id="mute8" />
      <Actor look={SIS} pose={sis} rimId="rimRed" shadow={0.5} />
      <Actor look={MO} pose={{ ...mo, x: moX, y: moY, ...faceAt(t, [[0, 'cool'], [52, 'shock']]) }} rimId="rimR" shadow={0.4} />
      <Banister />
    </g>
  );
};

// ---------- Sh9: Bottom crash landing at f436 (`t=8` exact tumble SFX + fx shake)! ----------
export const Sh9: React.FC<ShotProps> = ({ t, len }) => {
  const land = clamp((t - 8) / 10);
  const sq = t >= 8 ? settle(t - 8, 0.24, 1.2, 6) : 0;
  const mo: Pose = {
    ...basePose,
    x: lerp(1380, 1520, easeOut(land)),
    y: lerp(700, 910 - LEG_LEN * 0.72, easeOut(land)),
    scale: 0.92,
    yaw: -0.35,
    spin: lerp(-72, -52, easeOut(land)) + (t >= 8 ? settle(t - 8, 12, 1.1, 7) : 0),
    squash: Math.max(-0.1, sq),
    armL: { a: 78, b: 20 },
    armR: { a: 66, b: -15 },
    legL: { a: 32, b: -40 },
    legR: { a: -18, b: 25 },
    ...faceAt(t, [[0, 'shock'], [8, 'dizzy']]),
  };
  return (
    <g transform={camT(1430, 740, kf(t, [[0, 1.16], [len, 1.25]]))}>
      <Stairwell t={t + 122} id="mute9" />
      <Actor look={MO} pose={mo} rimId="rimR" shadow={0.8} />
      {t >= 8 ? <DizzyStars x={1435} y={655} t={t - 8} rx={115} ry={45} /> : null}
      <Banister />
    </g>
  );
};

// ---------- Sh10: Close-up Sister unmutes smugly ("Unmuted.") ----------
export const Sh10: React.FC<ShotProps> = ({ t, len, f }) => {
  const sc = 3.9 * (1 + 0.04 * clamp(t / len));
  const sis: Pose = {
    ...basePose,
    x: 960,
    y: 590 - HEAD.y * sc,
    scale: sc,
    yaw: -0.25,
    look: -0.4,
    headTilt: kf(t, [[0, -6], [14, 4]]),
    armR: { a: 120, b: 40 },
    handR: 'point',
    glint: clamp(t / 6),
    glintColor: '#5BE08A',
    ...faceAt(t, [[0, 'smug']]),
    talk: talkAt(f, mouthFrames, 'sis'),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-400 -240) scale(1.8)">
          <Stairwell t={t + 168} id="mute10" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#080612" opacity={0.28} />
      <Actor look={SIS} pose={sis} rimId="rimR" shadow={0} />
      <Sparkle x={1140} y={360} t={t} s={1.2} />
      <Tag x={1350} y={360} t={t} text="VOICE ON" mark="check" markT={4} w={215} />
    </g>
  );
};

// ---------- Sh11: Two-shot on stairs ("Miss my voice yet?") ----------
export const Sh11: React.FC<ShotProps> = ({ t, len, f }) => {
  const sis: Pose = {
    ...basePose,
    x: 680,
    y: 780 - LEG_LEN * 1.12,
    scale: 1.12,
    facing: 1,
    yaw: 0.45,
    look: 0.8,
    tilt: 7,
    armL: { a: 55, b: -60 },
    armR: { a: 55, b: -60 },
    ...faceAt(t, [[0, 'smug']]),
    talk: talkAt(f, mouthFrames, 'sis'),
  };
  const mo: Pose = {
    ...basePose,
    x: 1240,
    y: 880 - LEG_LEN * 0.92,
    scale: 0.92,
    facing: -1,
    yaw: -0.6,
    look: -0.8,
    tilt: -8,
    ...faceAt(t, [[0, 'tired']]),
  };
  return (
    <g transform={camT(960, 620, kf(t, [[0, 1.06], [len, 1.14]]))}>
      <Stairwell t={t + 206} id="mute11" />
      <Actor look={SIS} pose={sis} rimId="rimR" shadow={0.7} />
      <Actor look={MO} pose={mo} rimId="rimL" shadow={0.7} />
      <Banister />
    </g>
  );
};

// ---------- Sh12: Close-up reaction Mo ("Put it back on mute.") ----------
export const Sh12: React.FC<ShotProps> = ({ t, len, f }) => {
  const sc = 4.3 * (1 + 0.04 * clamp(t / len));
  const mo: Pose = {
    ...basePose,
    x: 960,
    y: 610 - HEAD.y * sc,
    scale: sc,
    yaw: 0.12,
    look: -0.3,
    headTilt: -6,
    ...faceAt(t, [[0, 'dizzy'], [10, 'tired']]),
    talk: talkAt(f, mouthFrames, 'mo'),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-520 -260) scale(1.9)">
          <Stairwell t={t + 240} id="mute12" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#080612" opacity={0.28} />
      <Actor look={MO} pose={mo} rimId="rimL" shadow={0} />
      <DizzyStars x={960} y={240} t={t + 12} rx={170} ry={58} />
    </g>
  );
};
