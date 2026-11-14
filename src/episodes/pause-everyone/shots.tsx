import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, easeOut, camT, LOOKS,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand,
  Study, Desk, STUDY, Stairwell, Rooftop, Schematic, Arrow, SchLabel, CountUp,
  Cookie, CookieStack, Plate, PaperStack, Cat, Foreground, LightVeil, Glow, Sparkle, TitleCard, ShotProps,
} from '../../engine';

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const SIS = LOOKS.sis;
const MOM = LOOKS.mom;
const SUIT = LOOKS.suit;
const P = (o: Partial<Pose>): Pose => ({ ...basePose, ...o });

// S1: Kitchen — Sister frozen mid-argument, Pip smugly walks past
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const sPos = stand(KITCHEN, 0.34, 0.45);
  const pPos = stand(KITCHEN, 0.65, 0.55);
  const pipX = kf(t, [[0, pPos.x + 140], [len * 0.7, pPos.x - 40]]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.32], [len, 1.4]]))}>
      <Kitchen t={0} id="pe_k1" />
      <Hero look={SIS} pose={P({ x: sPos.x, y: sPos.y + 40, scale: 0.72, yaw: 0.45, look: 0.8, armR: { a: 105, b: 15 }, handR: 'point', expr: 'shock' })} shadow={0.6} />
      <Hero look={PIP} pose={{ ...P({ x: pipX, y: pPos.y, scale: pPos.scale, yaw: -0.35, look: -0.5, armL: { a: 25, b: -10 }, armR: { a: 15, b: -10 } }), ...faceAt(t, [[0, 'neutral'], [20, 'smug']]) }} shadow={0.6} />
      <KitchenIsland />
      <Foreground blur={8}><path d="M 1320 1000 Q 1390 780 1520 740 Q 1450 860 1440 1000 Z" fill="#0E1610" /></Foreground>
    </g>
  );
};

// S2: Kitchen Island — Pip steals the last cookie while Cat watches
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const pPos = stand(KITCHEN, 0.46, 0.42);
  const cPos = islandTop(0.62, 0.48);
  const grab = poseAt(t, [
    { f: 0, p: { x: pPos.x, y: pPos.y, scale: pPos.scale, yaw: 0.5, look: 0.8, armR: { a: 20, b: -15 } } },
    { f: 18, p: { armR: { a: 95, b: -5 }, handR: 'point' }, ease: easeOut },
    { f: 45, p: { armR: { a: 120, b: 55 }, expr: 'happy' }, ease: easeOut },
  ]);
  return (
    <g transform={camT(980, 580, kf(t, [[0, 1.65], [len, 1.78]]))}>
      <Kitchen t={0} id="pe_k2" />
      <Hero look={PIP} pose={grab} shadow={0.5} />
      <KitchenIsland />
      <Plate x={cPos.x} y={cPos.y} s={0.75} />
      {t < 24 && <Cookie x={cPos.x} y={cPos.y - 8} s={0.85} />}
      <Cat x={cPos.x + 150} y={cPos.y - 10} mood="alert" f={t} />
    </g>
  );
};

// S3: Study — Mo frozen mid-trip, Pip reacts
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const mPos = stand(STUDY, 0.36, 0.55);
  const pPos = stand(STUDY, 0.7, 0.58);
  return (
    <g transform={camT(960, 550, kf(t, [[0, 1.25], [len, 1.34]]))}>
      <Study t={0} id="pe_st1" />
      <Hero look={MO} pose={P({ x: mPos.x, y: mPos.y, scale: mPos.scale, yaw: 0.4, headTilt: -14, armL: { a: 110, b: 20 }, armR: { a: 95, b: 35 }, expr: 'shock' })} shadow={0.6} />
      <Hero look={PIP} pose={P({ x: pPos.x, y: pPos.y, scale: pPos.scale, yaw: -0.4, look: -0.7, armR: { a: 85, b: 40 }, expr: 'oops' })} shadow={0.6} />
      <Desk x0={420} x1={1500} y={760} laptop lamp />
    </g>
  );
};

// S4: Kitchen — Mum frozen walking in, Pip hides behind island
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const mumPos = stand(KITCHEN, 0.28, 0.48);
  const pPos = stand(KITCHEN, 0.68, 0.52);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.28], [len, 1.38]]))}>
      <Kitchen t={0} id="pe_k3" />
      <Hero look={MOM} pose={P({ x: mumPos.x, y: mumPos.y, scale: mumPos.scale, yaw: 0.5, armR: { a: 75, b: 25 }, expr: 'worried' })} shadow={0.6} />
      <Hero look={PIP} pose={P({ x: pPos.x, y: pPos.y + 30, scale: pPos.scale, yaw: -0.45, look: -0.8, squash: 0.08, expr: 'smug' })} shadow={0.6} />
      <KitchenIsland />
    </g>
  );
};

// S5: Title Card — "WHAT IF YOU COULD PAUSE EVERYONE ELSE?"
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <TitleCard t={t} lines={['WHAT IF YOU COULD', 'PAUSE EVERYONE ELSE?']} accent="#7FD4FF" />
  </g>
);

// S6: Rooftop — Pip celebrating at sunset
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const cheer = poseAt(t, [
    { f: 0, p: { x: 960, y: 760, scale: 0.85, armL: { a: 30, b: -10 }, armR: { a: 30, b: -10 }, expr: 'happy' } },
    { f: 22, p: { armL: { a: 140, b: 20 }, armR: { a: 140, b: 20 }, squash: -0.06 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.1], [len, 1.2]]))}>
      <Rooftop t={t} />
      <Hero look={PIP} pose={cheer} shadow={0.7} />
      <Sparkle x={820} y={480} t={t - 10} />
      <Sparkle x={1110} y={520} t={t - 22} />
    </g>
  );
};

// S7: Stairwell — Pip sneaks past The Suit (frozen)
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const pipX = kf(t, [[0, 1260], [len, 940]]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.18], [len, 1.28]]))}>
      <Stairwell t={0} id="pe_sw1" />
      <Hero look={SUIT} pose={P({ x: 700, y: 740, scale: 0.84, yaw: 0.3, armL: { a: 15, b: -10 }, armR: { a: 15, b: -10 }, expr: 'neutral' })} shadow={0.6} />
      <Hero look={PIP} pose={P({ x: pipX, y: 760, scale: 0.85, yaw: -0.5, look: -0.6, armL: { a: 55, b: 40 }, armR: { a: 30, b: 20 }, expr: 'smug' })} shadow={0.6} />
    </g>
  );
};

// S8: Study — Pip & frozen Mo with towering stack of papers
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const pPos = stand(STUDY, 0.42, 0.56);
  const mPos = stand(STUDY, 0.72, 0.56);
  return (
    <g transform={camT(960, 550, kf(t, [[0, 1.24], [len, 1.34]]))}>
      <Study t={t} id="pe_st2" />
      <Hero look={PIP} pose={P({ x: pPos.x, y: pPos.y, scale: pPos.scale, yaw: 0.3, armR: { a: 75, b: 35 }, expr: 'happy' })} shadow={0.6} />
      <Hero look={MO} pose={P({ x: mPos.x, y: mPos.y, scale: mPos.scale, yaw: -0.35, headTilt: 12, expr: 'worried' })} shadow={0.6} />
      <Desk x0={420} x1={1500} y={760} laptop lamp />
      <PaperStack x={840} y={620} n={Math.min(10, Math.floor(t / 8) + 2)} />
    </g>
  );
};

// S9: Stairwell — Sister & Suit frozen while Pip naps calmly
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.15], [len, 1.24]]))}>
    <Stairwell t={0} id="pe_sw2" />
    <Hero look={SIS} pose={P({ x: 560, y: 760, scale: 0.7, yaw: 0.4, expr: 'neutral' })} shadow={0.5} />
    <Hero look={SUIT} pose={P({ x: 1360, y: 740, scale: 0.84, yaw: -0.4, expr: 'neutral' })} shadow={0.5} />
    <Hero look={PIP} pose={P({ x: 960, y: 780, scale: 0.86, headTilt: 22, squash: 0.06, expr: 'happy' })} shadow={0.6} />
  </g>
);

// S10: Schematic — Physics Catch Warning
export const S10: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} />
    <SchLabel x={960} y={240} t={t} text="ONE PHYSICS PROBLEM" size={56} color="#FF7B54" />
    <Arrow x0={520} y0={520} x1={1400} y1={520} t={t - 15} color="#7FD4FF" />
    <CountUp x={960} y={680} t={t - 20} to={0} suffix="% MOTION" size={76} />
  </g>
);

// S11: Schematic — Frozen Air Molecules
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} />
    <SchLabel x={960} y={210} t={t} text="FROZEN AIR MOLECULES" size={52} color="#7FD4FF" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <circle key={i} cx={440 + i * 150} cy={520 + ((i % 2) * 90 - 45)} r={30} fill="#7FD4FF" opacity={0.85} />
    ))}
    <SchLabel x={960} y={760} t={t - 25} text="0.00 m/s = NO OXYGEN FLOW" size={38} color="#FFD27D" />
  </g>
);

// S12: Darkened Study — Light Cannot Reach Your Eyes
export const S12: React.FC<ShotProps> = ({ t }) => {
  const pPos = stand(STUDY, 0.5, 0.55);
  return (
    <g>
      <Study t={0} id="pe_st3" />
      <Hero look={PIP} pose={P({ x: pPos.x, y: pPos.y, scale: pPos.scale, armL: { a: 60, b: 40 }, armR: { a: 60, b: 40 }, expr: 'shock' })} shadow={0.6} />
      <rect width={1920} height={1080} fill="#05070E" opacity={kf(t, [[0, 0.2], [45, 0.85]])} />
      <Glow x={pPos.x} y={pPos.y - 120} r={260} o={0.25} />
    </g>
  );
};

// S13: Schematic — Air Wall = Solid Concrete
export const S13: React.FC<ShotProps> = ({ t }) => {
  const hitX = kf(t, [[0, 620], [28, 790], [45, 775]]);
  return (
    <g>
      <Schematic t={t} />
      <Hero look={PIP} pose={P({ x: hitX, y: 740, scale: 0.84, yaw: 0.6, armR: { a: 80, b: 10 }, expr: 'shock' })} shadow={0.5} />
      <rect x={870} y={240} width={54} height={600} rx={8} fill="#7FD4FF" opacity={0.75} />
      <SchLabel x={1280} y={500} t={t - 15} text="AIR = CONCRETE WALL" size={48} color="#FF7B54" />
    </g>
  );
};

// S14: Kitchen — UNPAUSE! Flash + Pop
export const S14: React.FC<ShotProps> = ({ t }) => {
  const pPos = stand(KITCHEN, 0.5, 0.52);
  return (
    <g>
      <Kitchen t={t} id="pe_k4" />
      <Hero look={PIP} pose={P({ x: pPos.x, y: pPos.y, scale: pPos.scale, armL: { a: 120, b: 15 }, armR: { a: 120, b: 15 }, expr: 'oops' })} shadow={0.6} />
      <KitchenIsland />
      {t < 10 && <rect width={1920} height={1080} fill="#FFFFFF" opacity={1 - t / 10} />}
    </g>
  );
};

// S15: Kitchen — Whole Family + Mo + Suit staring at Pip
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const p1 = stand(KITCHEN, 0.18, 0.5);
  const p2 = stand(KITCHEN, 0.34, 0.52);
  const p3 = stand(KITCHEN, 0.52, 0.55);
  const p4 = stand(KITCHEN, 0.70, 0.52);
  const p5 = stand(KITCHEN, 0.85, 0.5);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.08], [len, 1.15]]))}>
      <Kitchen t={t} id="pe_k5" />
      <Hero look={MOM} pose={P({ x: p1.x, y: p1.y, scale: p1.scale, yaw: 0.45, look: 0.8, expr: 'shock' })} shadow={0.6} />
      <Hero look={SIS} pose={P({ x: p2.x, y: p2.y + 30, scale: 0.72, yaw: 0.4, look: 0.8, expr: 'shock' })} shadow={0.6} />
      <Hero look={PIP} pose={P({ x: p3.x, y: p3.y, scale: p3.scale, armL: { a: 45, b: 65 }, armR: { a: 45, b: 65 }, expr: 'oops' })} shadow={0.6} />
      <Hero look={MO} pose={P({ x: p4.x, y: p4.y, scale: p4.scale, yaw: -0.4, look: -0.8, expr: 'shock' })} shadow={0.6} />
      <Hero look={SUIT} pose={P({ x: p5.x, y: p5.y, scale: p5.scale, yaw: -0.45, look: -0.8, expr: 'worried' })} shadow={0.6} />
      <KitchenIsland />
    </g>
  );
};

// S16: Close-up Kitchen — Pip holding cookie stack, caught red-handed
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const pPos = stand(KITCHEN, 0.5, 0.5);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Kitchen t={t} id="pe_k6" />
      <Hero look={PIP} pose={P({ x: pPos.x, y: pPos.y, scale: pPos.scale, armR: { a: 90, b: 30 }, expr: 'oops' })} shadow={0.6} />
      <KitchenIsland />
      <CookieStack x={pPos.x + 120} y={620} n={5} />
      <LightVeil id="pe_v16" lights={[[960, 420, 680]]} o={0.45} />
    </g>
  );
};
