import React from 'react';
import {
  Actor, Cat, Plate, PlateTop, CookieTop, LOOKS, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, camT,
  Foreground, FocusRings, Sparkle, Tag, Gauge, TitleCard, Tabletop,
  Kitchen, KitchenIsland, stand, KITCHEN, islandTop, Bedroom, bedSit, BedDuvet, Schematic, SchLabel, CountUp, SCH, Rooftop,
  Glow, LEG_LEN, HEAD, ShotProps,
} from '../../engine';
import dialogue from './dialogue.json';
import { talkAt, naturalBlink, MouthMap } from '../dialogueHelper';

const LEO = LOOKS.leo;
const MOM = LOOKS.mom;
const GOLD = '#FFE27A';
const mouthFrames = dialogue.mouthFrames as MouthMap;

// ---------- Sh1: Macro Tabletop — Plate with crumbs & last cookie, sneaky hand wipes crumbs ----------
export const Sh1: React.FC<ShotProps> = ({ t, len }) => {
  const swipe = easeOut(clamp((t - 10) / 14));
  return (
    <g transform={camT(960, 510, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Tabletop edge={720} kind="stone" />
      <PlateTop x={960} y={500} r={240} />
      <CookieTop x={930} y={485} r={85} rot={18} />
      {[
        [1035, 520, 9],
        [1058, 492, 6],
        [835, 555, 8],
        [990, 565, 7],
      ].map(([cx, cy, cr], i) => (
        <circle key={i} cx={cx + swipe * 260} cy={cy} r={cr} fill="#C68846" opacity={1 - swipe} />
      ))}
      <g transform={`translate(${lerp(640, 1280, swipe)} 555)`} opacity={t < 6 ? 0 : 1} filter="url(#rimR)">
        <path d="M 480 680 Q 220 320 12 10" stroke={LEO.line} strokeWidth={112} fill="none" strokeLinecap="round" />
        <path d="M 480 680 Q 220 320 12 10" stroke={LEO.limb} strokeWidth={92} fill="none" strokeLinecap="round" />
        <ellipse cx={0} cy={0} rx={72} ry={46} fill={LEO.hand} stroke={LEO.line} strokeWidth={8} />
      </g>
    </g>
  );
};

// ---------- Sh2: Wide Kitchen dusk — Mum enters left suspicious, Leo whistling arms behind back ----------
export const Sh2: React.FC<ShotProps> = ({ t, len }) => {
  const m = stand(KITCHEN, 0.34, 0.44, 0.65);
  const l = stand(KITCHEN, 0.66, 0.44, 0.65);
  const pl = islandTop(0.42, 0.5);
  const cat = islandTop(0.56, 0.5);
  const mom = poseAt(t, [
    { f: 0, p: { x: m.x - 40, y: m.y, scale: m.scale, facing: 1, yaw: 0.4, look: 0.8, armL: { a: 55, b: -60 }, armR: { a: 55, b: -60 } } },
    { f: 28, p: { x: m.x }, ease: easeOut },
  ]);
  const leo = poseAt(t, [
    { f: 0, p: { x: l.x, y: l.y, scale: l.scale, facing: -1, yaw: -0.25, look: -0.3, armL: { a: -22, b: 25 }, armR: { a: -22, b: 25 } } },
    { f: 24, p: { headTilt: -5, look: -0.6 } },
  ]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 0.96], [len, 1.04]]))}>
      <Kitchen t={t} id="g2" veil={0.44} />
      <Actor look={MOM} pose={{ ...mom, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <Actor look={LEO} pose={{ ...leo, ...faceAt(t, [[0, 'neutral']]), blink: naturalBlink(t, 44, 14) }} rimId="rimL" shadow={0} />
      <KitchenIsland />
      <Plate x={pl.x} y={pl.y} s={1.1} />
      <Cat x={cat.x} y={cat.y} mood="alert" f={t} />
    </g>
  );
};

// ---------- Sh3: OTS behind Leo's blurred cap onto Mum ("Leo... did you eat all my warm cookies?") ----------
export const Sh3: React.FC<ShotProps> = ({ t, len, f }) => {
  const mom = poseAt(t, [
    { f: 0, p: { x: 840, y: 740, scale: 1.5, facing: 1, yaw: 0.35, look: 0.7, armL: { a: 55, b: -60 }, armR: { a: 55, b: -60 } } },
    { f: 34, p: { armR: { a: 98, b: 18 }, handR: 'point', tilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 860]]), 490, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-320 -180) scale(1.45)">
          <Kitchen t={t + 75} id="g3" veil={0.44} />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#080612" opacity={0.22} />
      <Actor look={MOM} pose={{ ...mom, ...faceAt(t, [[0, 'smug'], [30, 'worried']]), talk: talkAt(f, mouthFrames, 'mom') }} rimId="rimR" shadow={0} />
      <Foreground blur={12}>
        <path d="M 1340 1220 Q 1440 800 1670 810 L 2040 1220 Z" fill="#18121B" />
        <circle cx={1660} cy={640} r={195} fill="#231926" />
        <path d="M 1450 560 L 1350 595 L 1520 620 Z" fill="#231926" />
      </Foreground>
    </g>
  );
};

// ---------- Sh4: Medium Leo ("What? No!") -> exact bulb_pop & glow at f180 (t=40)! ----------
export const Sh4: React.FC<ShotProps> = ({ t, len, f }) => {
  const lit = t >= 40;
  const gAmt = lit ? easeOut(clamp((t - 40) / 8)) : 0;
  const leo = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 1.5, facing: -1, yaw: -0.25, look: -0.5, armL: { a: 96, b: 25 }, armR: { a: 96, b: 25 } } },
    { f: 40, p: { armL: { a: 126, b: 30 }, armR: { a: 126, b: 30 }, headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -180) scale(1.45)">
          <Kitchen t={t + 140} id="g4" veil={lit ? 0.18 : 0.44} />
        </g>
      </g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#080612" opacity={lit ? 0.1 : 0.25} />
      {lit ? <Glow x={960} y={440} r={440 * gAmt + 60} kind="warm" o={0.78} /> : null}
      <Actor
        look={LEO}
        pose={{ ...leo, glint: gAmt, glintColor: GOLD, ...faceAt(t, [[0, 'oops'], [40, 'shock']]), talk: talkAt(f, mouthFrames, 'leo') }}
        rimId="rimR"
        shadow={0}
      />
      {lit ? <Sparkle x={1100} y={340} t={t - 40} s={1.3} /> : null}
      {lit ? <FocusRings x={960} y={450} t={t - 40} r0={75} color={GOLD} /> : null}
    </g>
  );
};

// ---------- Sh5: Tight two-shot Kitchen — Leo STILL glowing finishes "I wasn't even near the kitchen." ----------
export const Sh5: React.FC<ShotProps> = ({ t, len, f }) => {
  const m = stand(KITCHEN, 0.34, 0.46, 0.65);
  const l = stand(KITCHEN, 0.66, 0.46, 0.65);
  const pulse = Math.sin(t * 0.6) * 28;
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.1], [len, 1.16]]))}>
      <Kitchen t={t + 212} id="g5" veil={0.25} />
      <Glow x={l.x} y={l.y - 110} r={340 + pulse} kind="warm" o={0.68} />
      <Actor look={MOM} pose={{ ...basePose, x: m.x, y: m.y, scale: m.scale, yaw: 0.35, look: 0.8, armL: { a: 55, b: -60 }, armR: { a: 55, b: -60 }, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
      <Actor look={LEO} pose={{ ...basePose, x: l.x, y: l.y, scale: l.scale, facing: -1, yaw: -0.35, look: -0.7, armL: { a: 80, b: 30 }, glint: 1, glintColor: GOLD, ...faceAt(t, [[0, 'oops']]), talk: talkAt(f, mouthFrames, 'leo') }} rimId="rimL" shadow={0} />
      <KitchenIsland />
    </g>
  );
};

// ---------- Sh6: TitleCard Bedroom at night — title_boom at f263 (t=3)! ----------
export const Sh6: React.FC<ShotProps> = ({ t, len }) => {
  const bs = bedSit(0.24);
  const pulse = Math.sin(t * 0.4) * 35;
  return (
    <g transform={camT(960, 530, kf(t, [[0, 0.96], [len, 1.04]]))}>
      <Bedroom t={t} id="g6" duvet={false} clock="02:14" lamp={0} veil={0.65} />
      <Glow x={bs.x} y={bs.y - 60} r={320 + pulse} kind="warm" o={0.78} />
      <Actor look={LEO} pose={{ ...basePose, x: bs.x, y: bs.y, scale: bs.scale, yaw: 0.25, look: 0.2, glint: 1, glintColor: GOLD, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <BedDuvet knees={0.9} />
      <TitleCard t={t - 2} lines={['WHAT IF EVERY LIE', 'MADE YOU GLOW?']} accent="GLOW" accentT={14} size={92} y={175} />
    </g>
  );
};

// ---------- Sh7: Schematic dark blueprint — Truth Lumen meter surging at f340 (t=14)! ----------
export const Sh7: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / 32));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t} id="g7" />
      <SchLabel x={960} y={240} t={t - 2} text="TRUTH OUTPUT CALIBRATION" size={48} color={SCH.dim} />
      <Gauge x={460} y={440} w={1000} p={p} label="LUMINOSITY OUTPUT" danger={0.55} />
      <CountUp x={960} y={670} t={t - 4} to={9500} dur={26} size={108} suffix=" LM" color={GOLD} />
      <Tag x={960} y={810} t={t - 18} text="EXPOSED!" mark="x" markT={3} w={340} />
    </g>
  );
};

// ---------- Sh8: Close-up Leo sweating nervously, amber pulse rising ----------
export const Sh8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.2 * (1 + 0.04 * clamp(t / len));
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-520 -260) scale(1.85)">
          <Kitchen t={t + 374} id="g8" veil={0.22} />
        </g>
      </g>
      <Glow x={960} y={540} r={540} kind="warm" o={0.58 + 0.14 * Math.sin(t * 0.9)} />
      <Actor look={LEO} pose={{ ...basePose, x: 960, y: 600 - HEAD.y * sc, scale: sc, yaw: -0.1, look: -0.4, glint: 1, glintColor: GOLD, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- Sh9: Medium Kitchen — Leo caves ("Okay, maybe one tiny bite!") ----------
export const Sh9: React.FC<ShotProps> = ({ t, len, f }) => {
  const k = stand(KITCHEN, 0.56, 0.5, 0.65);
  const leo = poseAt(t, [
    { f: 0, p: { x: k.x, y: k.y, scale: k.scale * 1.15, facing: -1, yaw: -0.3, look: -0.6, armL: { a: 86, b: 36 }, armR: { a: 86, b: 36 } } },
    { f: 28, p: { armL: { a: 120, b: 20 }, armR: { a: 120, b: 20 }, tilt: 6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 490, kf(t, [[0, 1.08], [len, 1.14]]))}>
      <Kitchen t={t + 409} id="g9" veil={0.2} />
      <Glow x={k.x} y={k.y - 120} r={420} kind="warm" o={0.78} />
      <Actor look={LEO} pose={{ ...leo, glint: 1, glintColor: GOLD, ...faceAt(t, [[0, 'oops']]), talk: talkAt(f, mouthFrames, 'leo') }} rimId="rimR" shadow={0} />
      <KitchenIsland />
    </g>
  );
};

// ---------- Sh10: Extreme close-up supernova flash exact on "five!" at f501 (t=35, buzzer SFX)! ----------
export const Sh10: React.FC<ShotProps> = ({ t, len, f }) => {
  const sc = 4.6 * (1 + 0.05 * clamp(t / len));
  const surge = t >= 35;
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-540 -260) scale(1.9)">
          <Kitchen t={t + 466} id="g10" veil={surge ? 0.05 : 0.2} />
        </g>
      </g>
      <Glow x={960} y={540} r={surge ? 920 : 540} kind="warm" o={surge ? 0.92 : 0.65} />
      <Actor look={LEO} pose={{ ...basePose, x: 960, y: 610 - HEAD.y * sc, scale: sc, yaw: 0.05, glint: 1, glintColor: GOLD, ...faceAt(t, [[0, 'oops'], [35, 'shock']]), talk: talkAt(f, mouthFrames, 'leo') }} rimId="rimR" shadow={0} />
      {surge ? <FocusRings x={960} y={480} t={t - 35} r0={90} color={GOLD} /> : null}
      {surge ? <Sparkle x={1180} y={320} t={t - 36} s={1.4} /> : null}
    </g>
  );
};

// ---------- Sh11: OTS Mum deadpan across blazing orange reflection ("Leo, you're brighter than—") ----------
export const Sh11: React.FC<ShotProps> = ({ t, len, f }) => {
  const mom: Pose = {
    ...basePose,
    x: 840,
    y: 740,
    scale: 1.5,
    facing: 1,
    yaw: 0.35,
    look: 0.7,
    glasses: 1,
    armL: { a: 55, b: -60 },
    armR: { a: 55, b: -60 },
    ...faceAt(t, [[0, 'cool']]),
    talk: talkAt(f, mouthFrames, 'mom'),
  };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 885]]), 490, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-320 -180) scale(1.45)">
          <Kitchen t={t + 515} id="g11" veil={0.18} />
        </g>
      </g>
      <Glow x={1650} y={540} r={680} kind="warm" o={0.62} />
      <Actor look={MOM} pose={mom} rimId="rimR" shadow={0} />
      <Foreground blur={12}>
        <path d="M 1360 1220 Q 1450 810 1680 820 L 2040 1220 Z" fill="#2A1C12" />
      </Foreground>
    </g>
  );
};

// ---------- Sh12: Rooftop wide beacon finale ("—the streetlight outside.") ----------
export const Sh12: React.FC<ShotProps> = ({ t, len, f }) => {
  const pulse = Math.sin(t * 0.35) * 40;
  const leo: Pose = {
    ...basePose,
    x: 1110,
    y: 840 - LEG_LEN * 0.72,
    scale: 0.72,
    facing: -1,
    yaw: -0.35,
    look: -0.7,
    armL: { a: 28, b: 18 },
    armR: { a: 28, b: 18 },
    glint: 1,
    glintColor: GOLD,
    ...faceAt(t, [[0, 'oops']]),
  };
  const mom: Pose = {
    ...basePose,
    x: 780,
    y: 840 - LEG_LEN * 0.75,
    scale: 0.75,
    facing: 1,
    yaw: 0.35,
    look: 0.7,
    glasses: 1,
    armL: { a: 55, b: -60 },
    armR: { a: 55, b: -60 },
    ...faceAt(t, [[0, 'happy']]),
    talk: talkAt(f, mouthFrames, 'mom'),
  };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 0.98], [len, 1.05]]))}>
      <Rooftop t={t} sunX={960} sunY={710} blackout={0.4} low={0} />
      <Glow x={leo.x} y={leo.y - 100} r={540 + pulse} kind="warm" o={0.85} />
      <Actor look={MOM} pose={mom} rimId="rimR" shadow={0.6} />
      <Actor look={LEO} pose={leo} rimId="rimL" shadow={0.6} />
      <Cat x={640} y={842} mood="peek" f={t} />
    </g>
  );
};
