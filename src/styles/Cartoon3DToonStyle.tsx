import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordSubtitles, WordTiming } from "../components/WordSubtitles";
import wordsData from "../data/words_style2.json";

const words = wordsData as WordTiming[];

const ToonWorldBase: React.FC<{ bridgeTilt?: number; bridgeDrop?: number; camZoom?: number; children?: React.ReactNode }> = ({
  bridgeTilt = 0,
  bridgeDrop = 0,
  camZoom = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: "100%", height: "100%", transform: `scale(${camZoom})`, transformOrigin: "center 55%" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <linearGradient id="toonSky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3e7fd2" />
            <stop offset="100%" stopColor="#b8d0ec" />
          </linearGradient>
          <filter id="dof2"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <rect width="1920" height="1080" fill="url(#toonSky2)" />
        <g fill="#ffffff" opacity="0.88" transform={`translate(${(frame * 0.6) % 240}, 0)`}>
          <ellipse cx="320" cy="190" rx="140" ry="48" />
          <ellipse cx="1450" cy="230" rx="170" ry="54" />
        </g>
        <g filter="url(#dof2)" opacity="0.85">
          <rect x="110" y="450" width="180" height="270" fill="#c97a63" stroke="#030303" strokeWidth="6" />
          <polygon points="90,450 200,360 310,450" fill="#7c4234" stroke="#030303" strokeWidth="6" />
          <rect x="340" y="490" width="150" height="230" fill="#e2c799" stroke="#030303" strokeWidth="6" />
          <rect x="1440" y="460" width="190" height="260" fill="#d99b66" stroke="#030303" strokeWidth="6" />
          <polygon points="1420,460 1535,375 1650,460" fill="#8b4738" stroke="#030303" strokeWidth="6" />
        </g>
        <rect x="0" y="790" width="1920" height="290" fill="#467eb8" />
        <line x1="0" y1="790" x2="1920" y2="790" stroke="#030303" strokeWidth="6" />
        <g transform={`translate(960, ${700 + bridgeDrop}) rotate(${bridgeTilt}) translate(-960, -700)`}>
          <rect x="180" y="685" width="1560" height="44" rx="8" fill="#b87c4c" stroke="#030303" strokeWidth="7" />
          <line x1="280" y1="685" x2="280" y2="420" stroke="#2f3542" strokeWidth="18" />
          <line x1="1640" y1="685" x2="1640" y2="420" stroke="#2f3542" strokeWidth="18" />
          <path d="M 280,430 Q 960,640 1640,430" fill="none" stroke="#1e272e" strokeWidth="8" />
        </g>
        {children}
      </svg>
    </div>
  );
};

const Soldier: React.FC<{ x: number; y: number; shocked?: boolean }> = ({ x, y, shocked }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-26" y="25" width="52" height="72" rx="18" fill="#c0392b" stroke="#241726" strokeWidth="8" />
    <rect x="-42" y="-58" width="84" height="78" rx="38" fill="#fde3c8" stroke="#241726" strokeWidth="8" />
    <rect x="-32" y="-108" width="64" height="54" rx="10" fill="#1e272e" stroke="#241726" strokeWidth="7" />
    <circle cx="-14" cy="-22" r="6" fill="#241726" />
    <circle cx="14" cy="-22" r="6" fill="#241726" />
    {shocked && <ellipse cx="0" cy="-2" rx="10" ry="12" fill="#241726" />}
    <line x1="-14" y1="97" x2="-18" y2="138" stroke="#241726" strokeWidth="10" strokeLinecap="round" />
    <line x1="14" y1="97" x2="18" y2="138" stroke="#241726" strokeWidth="10" strokeLinecap="round" />
  </g>
);

const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, 360], [1, 1.1]);
  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const marchBob = Math.abs(Math.sin(frame * 0.25)) * 16;

  return (
    <AbsoluteFill>
      <ToonWorldBase camZoom={zoom}>
        {[0, 1, 2, 3].map((i) => (
          <Soldier key={i} x={560 + i * 240} y={550 - marchBob} />
        ))}
      </ToonWorldBase>
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", transform: `scale(${titleScale})`, color: "#fff", textShadow: "0 6px 0 #241726", fontSize: 62, fontWeight: 900 }}>
        1831: 74 SOLDIERS BROKE A BRIDGE
      </div>
    </AbsoluteFill>
  );
};

const Scene2SwingAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const swingAngle = Math.sin(frame * 0.09) * interpolate(frame, [0, 360], [10, 48]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#87ceeb" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <rect width="1920" height="1080" fill="#9bd1f5" />
        <rect x="0" y="790" width="1920" height="290" fill="#6ab04c" />
        <line x1="0" y1="790" x2="1920" y2="790" stroke="#241726" strokeWidth="6" />
        {/* Swing Frame */}
        <line x1="650" y1="790" x2="860" y2="180" stroke="#241726" strokeWidth="16" />
        <line x1="1270" y1="790" x2="1060" y2="180" stroke="#241726" strokeWidth="16" />
        <line x1="820" y1="180" x2="1100" y2="180" stroke="#241726" strokeWidth="20" />
        {/* Swinging Kid */}
        <g transform={`translate(960, 180) rotate(${swingAngle})`}>
          <line x1="0" y1="0" x2="0" y2="380" stroke="#241726" strokeWidth="8" />
          <rect x="-45" y="380" width="90" height="18" rx="6" fill="#e67e22" stroke="#241726" strokeWidth="6" />
          <circle cx="0" cy="310" r="36" fill="#fde3c8" stroke="#241726" strokeWidth="7" />
          <circle cx="-12" cy="306" r="5" fill="#241726" />
          <circle cx="12" cy="306" r="5" fill="#241726" />
        </g>
        <g transform="translate(960, 110)">
          <rect x="-340" y="-44" width="680" height="88" rx="18" fill="#ffd32a" stroke="#241726" strokeWidth="6" />
          <text x="0" y="12" textAnchor="middle" fill="#241726" fontSize="34" fontWeight="900">RESONANCE = PUSHING A SWING IN RHYTHM</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const Scene3SnapAndSplash: React.FC = () => {
  const frame = useCurrentFrame();
  const snapFrame = 210;
  const isSnapped = frame >= snapFrame;
  const flashOpacity = frame >= snapFrame && frame < snapFrame + 8 ? 0.9 : 0;
  const sway = !isSnapped ? Math.sin(frame * 0.35) * 18 : 0;
  const tilt = isSnapped ? interpolate(frame, [snapFrame, snapFrame + 25], [0, 18], { extrapolateRight: "clamp" }) : 0;
  const drop = isSnapped ? interpolate(frame, [snapFrame, snapFrame + 35], [0, 130], { extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill>
      <ToonWorldBase bridgeTilt={tilt} bridgeDrop={drop + sway * 0.4}>
        {[0, 1, 2].map((i) => (
          <Soldier key={i} x={660 + i * 280} y={550 + sway + drop} shocked={isSnapped} />
        ))}
      </ToonWorldBase>
      {flashOpacity > 0 && <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: flashOpacity }} />}
      {isSnapped && (
        <div style={{ position: "absolute", top: 110, left: "50%", transform: "translateX(-50%)", background: "#eb4d4b", color: "#fff", border: "6px solid #241726", borderRadius: 20, padding: "14px 36px", fontSize: 42, fontWeight: 900 }}>
          ANCHOR BOLT SNAPPED!
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene4BreakStepRule: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const signPop = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const oddBob = (i: number) => Math.abs(Math.sin(frame * (0.2 + i * 0.09) + i * 2)) * 18;

  return (
    <AbsoluteFill>
      <ToonWorldBase>
        {[0, 1, 2].map((i) => (
          <Soldier key={i} x={660 + i * 280} y={550 - oddBob(i)} />
        ))}
      </ToonWorldBase>
      <div style={{ position: "absolute", top: 120, left: "50%", transform: `translateX(-50%) scale(${signPop})`, background: "#ffd32a", color: "#241726", border: "6px solid #241726", borderRadius: 22, padding: "18px 44px", fontSize: 44, fontWeight: 900 }}>
        NEW RULE: BREAK STEP ON BRIDGES!
      </div>
    </AbsoluteFill>
  );
};

export const Cartoon3DToonStyle: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
    <Audio src={staticFile("audio/style2_master.wav")} />
    <Sequence from={0} durationInFrames={450}><Scene1Hook /></Sequence>
    <Sequence from={450} durationInFrames={450}><Scene2SwingAnalogy /></Sequence>
    <Sequence from={900} durationInFrames={480}><Scene3SnapAndSplash /></Sequence>
    <Sequence from={1380} durationInFrames={467}><Scene4BreakStepRule /></Sequence>
    <WordSubtitles words={words} accentColor="#ffd32a" />
  </AbsoluteFill>
);
