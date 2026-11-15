import React from 'react';
import {
  Actor, LOOKS, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, camT,
  FocusRings, Tag, TitleCard, Glow,
  Bedroom, bedSit, BedDuvet, Stairwell, Banister, hipGround, walkPose,
  HEAD, LEG_LEN, FONT, UI, ShotProps,
} from '../../engine';
import dialogue from './dialogue.json';
import { talkAt, naturalBlink, MouthMap } from '../dialogueHelper';

const LEO = LOOKS.leo;
const SIS = LOOKS.sis;
const RED = '#FF5A4A';
const mouthFrames = dialogue.mouthFrames as MouthMap;

// ---------- Sh1: Dark 03:12 AM Bedroom — Leo sits up alert ----------
export const Sh1: React.FC<ShotProps> = ({ t, len }) => {
  const bs = bedSit(0.24);
  const leo = poseAt(t, [
    { f: 0, p: { x: bs.x, y: bs.y, scale: bs.scale, yaw: 0.2, look: 0.4, tilt: -6 } },
    { f: 40, p: { tilt: 6, look: 0.8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 530, kf(t, [[0, 0.96], [len, 1.04]]))}>
      <Bedroom t={t} id="ho1" duvet={false} clock="03:12" lamp={0} veil={0.72} />
      <Glow x={1480} y={320} r={340} kind="warm" o={0.22} />
      <Actor look={LEO} pose={{ ...leo, ...faceAt(t, [[0, 'worried']]), blink: naturalBlink(t, 45, 10) }} rimId="rimRed" shadow={0} />
      <BedDuvet knees={0.9} />
    </g>
  );
};

// ---------- Sh2: Dark Stairwell landing — knocking outside door ("Leo, open up! I forgot my keys!") ----------
export const Sh2: React.FC<ShotProps> = ({ t, len }) => {
  const k1 = t >= 2 && t < 10;
  const k2 = t >= 12 && t < 20;
  return (
    <g transform={camT(640, 440, kf(t, [[0, 1.06], [len, 1.16]]))}>
      <Stairwell t={t + 81} id="ho2" />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#05040A" opacity={0.48} />
      <Glow x={320} y={360} r={260} kind="warm" o={k1 || k2 ? 0.45 : 0.16} />
      <FocusRings x={320} y={360} t={t - 2} r0={45} color={RED} />
      <FocusRings x={320} y={360} t={t - 12} r0={45} color={RED} />
      <Tag x={660} y={290} t={t - 2} text="KNOCK... KNOCK..." mark="x" markT={10} w={310} />
    </g>
  );
};

// ---------- Sh3: Leo walks down dark stairs ("Coming! Hang on!") ----------
export const Sh3: React.FC<ShotProps> = ({ t, len, f }) => {
  const x = lerp(640, 880, t / len);
  const leo = walkPose(x, t * 0.45, hipGround, 0.92, { look: 0.4, headTilt: -4 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 940]]), kf(t, [[0, 520], [len, 580]]), kf(t, [[0, 0.98], [len, 1.06]]))}>
      <Stairwell t={t + 158} id="ho3" />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#05040A" opacity={0.42} />
      <Actor look={LEO} pose={{ ...leo, ...faceAt(t, [[0, 'neutral']]), talk: talkAt(f, mouthFrames, 'leo') }} rimId="rimL" shadow={0.7} />
      <Banister />
    </g>
  );
};

// ---------- Sh4: Macro Phone Notification ("Then his phone buzzed.") exact glitch at f202 (t=2) ----------
export const Sh4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 0.98], [len, 1.07]]))}>
    <g filter="url(#blur16)">
      <g transform="translate(-380 -220) scale(1.6)">
        <Stairwell t={t + 200} id="ho4bg" />
      </g>
    </g>
    <rect x={-200} y={-200} width={2320} height={1480} fill="#05030A" opacity={0.62} />
    <g transform="translate(960 520)">
      <rect x={-380} y={-140} width={760} height={280} rx={36} fill={UI.pill} stroke={RED} strokeWidth={6} opacity={0.95} />
      <text x={-320} y={-40} fontFamily={FONT.ui} fontSize={32} fill={RED} letterSpacing={4}>
        NEW MESSAGE • SIS
      </text>
      <text x={-320} y={48} fontFamily={FONT.ui} fontSize={44} fill={UI.text} letterSpacing={1}>
        &quot;JUST GOT HOME. U UP?&quot;
      </text>
    </g>
    <FocusRings x={960} y={520} t={t - 2} r0={140} color={RED} />
  </g>
);

// ---------- Sh5: TitleCard dark stairwell — "A text from his sister." ----------
export const Sh5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Stairwell t={t + 246} id="ho5" />
    <rect x={-200} y={-200} width={2320} height={1480} fill="#05030A" opacity={0.58} />
    <TitleCard t={t - 1} lines={['NEVER ANSWER', 'THE SECOND KNOCK']} accent="SECOND" accentT={2} size={88} y={240} />
  </g>
);

// ---------- Sh6: Creepy shadow Sister at door ("Leo, I'm right outside.") ----------
export const Sh6: React.FC<ShotProps> = ({ t, len, f }) => {
  const sc = 2.4 * (1 + 0.05 * clamp(t / len));
  const sis: Pose = {
    ...basePose,
    x: 960,
    y: 660 - HEAD.y * sc,
    scale: sc,
    yaw: 0.08,
    look: 0.1,
    glint: 1,
    glintColor: RED,
    ...faceAt(t, [[0, 'smug']]),
    talk: talkAt(f, mouthFrames, 'sis'),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-440 -220) scale(1.75)">
          <Stairwell t={t + 275} id="ho6" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#050208" opacity={0.72} />
      <Glow x={960} y={480} r={420} kind="warm" o={0.18} />
      <Actor look={SIS} pose={sis} rimId="rimRed" shadow={0} />
      <Tag x={1360} y={340} t={t - 4} text="NOT HER" mark="x" markT={2} w={270} />
    </g>
  );
};

// ---------- Sh7: Medium-close Leo horrified ("Wait, who is at the door?!") ----------
export const Sh7: React.FC<ShotProps> = ({ t, len, f }) => {
  const sc = 2.65 * (1 + 0.05 * clamp(t / len));
  const leo: Pose = {
    ...basePose,
    x: 960,
    y: 660 - HEAD.y * sc,
    scale: sc,
    yaw: -0.1,
    look: -0.4,
    armL: { a: 122, b: 36 },
    armR: { a: 122, b: 36 },
    headTilt: kf(t, [[0, -6], [24, 4]]),
    ...faceAt(t, [[0, 'shock']]),
    talk: talkAt(f, mouthFrames, 'leo'),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-480 -220) scale(1.8)">
          <Stairwell t={t + 324} id="ho7" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#050208" opacity={0.48} />
      <Actor look={LEO} pose={leo} rimId="rimRed" shadow={0} />
    </g>
  );
};
