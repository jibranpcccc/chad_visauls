import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordSubtitles, WordTiming } from "../components/WordSubtitles";
import wordsData from "../data/five_s2_words.json";

const words = wordsData as WordTiming[];

const BeeChar: React.FC<{ x: number; y: number; scale?: number; flip?: boolean; wingT: number; goggles?: boolean; crown?: boolean; label?: string }> = ({
  x, y, scale = 1, flip = false, wingT, goggles = false, crown = false, label,
}) => {
  const wingFlap = Math.sin(wingT * 0.9) * 18;
  return (
    <g transform={`translate(${x}, ${y}) scale(${flip ? -scale : scale}, ${scale})`}>
      {/* Wings */}
      <ellipse cx="-10" cy="-42" rx="28" ry="18" transform={`rotate(${-28 + wingFlap})`} fill="#e0f2fe" stroke="#241726" strokeWidth="5" opacity="0.88" />
      <ellipse cx="14" cy="-38" rx="24" ry="15" transform={`rotate(${-12 - wingFlap})`} fill="#bae6fd" stroke="#241726" strokeWidth="5" opacity="0.82" />
      {/* Body */}
      <ellipse cx="0" cy="0" rx="46" ry="34" fill="#fbbf24" stroke="#241726" strokeWidth="6" />
      {/* Stripes */}
      <path d="M-16,-31 Q-10,0 -16,31" fill="none" stroke="#241726" strokeWidth="11" />
      <path d="M8,-33 Q14,0 8,33" fill="none" stroke="#241726" strokeWidth="11" />
      {/* Stinger */}
      <polygon points="-46,-4 -62,0 -46,4" fill="#241726" />
      {/* Head */}
      <circle cx="38" cy="-8" r="26" fill="#fde68a" stroke="#241726" strokeWidth="6" />
      {/* Eyes / Goggles */}
      {goggles ? (
        <g>
          <circle cx="46" cy="-12" r="11" fill="#38bdf8" stroke="#241726" strokeWidth="5" />
          <circle cx="49" cy="-15" r="3.5" fill="#fff" />
        </g>
      ) : (
        <circle cx="46" cy="-12" r="5" fill="#241726" />
      )}
      <path d="M36,4 Q44,10 52,4" fill="none" stroke="#241726" strokeWidth="4" strokeLinecap="round" />
      {/* Crown for Queen */}
      {crown && (
        <polygon points="24,-34 30,-52 38,-38 46,-54 54,-34" fill="#f59e0b" stroke="#241726" strokeWidth="4" />
      )}
      {label && (
        <g transform={`scale(${flip ? -1 : 1}, 1)`}>
          <rect x="-56" y="48" width="112" height="30" rx="15" fill="#241726" />
          <text x="0" y="68" textAnchor="middle" fill="#fde68a" fontSize="15" fontWeight="800">{label}</text>
        </g>
      )}
    </g>
  );
};

export const S2StorybookBees: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beats: B1(8-106), B2(106-210), B3(210-304), B4(304-407), B5(407-540)
  const isMeadow = frame < 106 || frame >= 407;
  const isHive = frame >= 106 && frame < 407;
  const isDance = frame >= 210 && frame < 407;

  const camZoom = frame < 106
    ? interpolate(frame, [0, 106], [1.0, 1.08])
    : frame >= 407
      ? interpolate(frame, [407, 540], [1.02, 1.12])
      : 1.0;

  const scoutX = frame < 106
    ? interpolate(frame, [0, 100], [280, 1380], { extrapolateRight: "clamp" })
    : frame < 210
      ? 620
      : frame < 407
        ? 960 + Math.sin((frame - 210) * 0.12) * 190
        : interpolate(frame, [407, 520], [320, 1320], { extrapolateRight: "clamp" });

  const scoutY = frame < 106
    ? 440 + Math.sin(frame * 0.18) * 35
    : frame < 210
      ? 520
      : frame < 407
        ? 520 + Math.sin((frame - 210) * 0.24) * 95
        : 400 + Math.sin(frame * 0.15) * 30;

  const titlePop = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const badgePop = spring({ frame: Math.max(0, frame - 415), fps, config: { damping: 12, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ fontFamily: "system-ui, -apple-system, sans-serif", overflow: "hidden" }}>
      <Audio src={staticFile("five/s2_master.wav")} />
      <div style={{ width: "100%", height: "100%", transform: `scale(${camZoom})`, transformOrigin: "center" }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <linearGradient id="skyS2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3e7fd2" />
              <stop offset="100%" stopColor="#b8d0ec" />
            </linearGradient>
            <filter id="dofS2"><feGaussianBlur stdDeviation="5" /></filter>
          </defs>

          {isMeadow ? (
            <>
              <rect width="1920" height="1080" fill="url(#skyS2)" />
              {/* Sun */}
              <circle cx="1640" cy="180" r="95" fill="#fde047" stroke="#241726" strokeWidth="6" />
              {/* Clouds */}
              <g fill="#fff" opacity="0.9" transform={`translate(${(frame * 0.5) % 180}, 0)`}>
                <ellipse cx="320" cy="190" rx="130" ry="44" />
                <ellipse cx="1020" cy="150" rx="150" ry="48" />
              </g>
              {/* DOF Distant Town & Hills */}
              <g filter="url(#dofS2)">
                <ellipse cx="500" cy="820" rx="750" ry="220" fill="#6ab04c" />
                <ellipse cx="1450" cy="830" rx="780" ry="240" fill="#589c3d" />
                <rect x="1390" y="470" width="170" height="220" fill="#e67e22" stroke="#241726" strokeWidth="6" />
                <polygon points="1370,470 1475,380 1580,470" fill="#a04000" stroke="#241726" strokeWidth="6" />
              </g>
              {/* Foreground Meadow */}
              <rect x="0" y="760" width="1920" height="320" fill="#78c850" stroke="#241726" strokeWidth="6" />
              {/* Giant Sunflowers */}
              {[240, 480, 1440, 1680].map((fx, i) => (
                <g key={i} transform={`translate(${fx}, 690)`}>
                  <line x1="0" y1="0" x2="0" y2="95" stroke="#241726" strokeWidth="10" />
                  <circle cx="0" cy="-28" r="56" fill="#facc15" stroke="#241726" strokeWidth="6" />
                  <circle cx="0" cy="-28" r="28" fill="#78350f" stroke="#241726" strokeWidth="5" />
                </g>
              ))}
              {/* Bees */}
              <BeeChar x={scoutX} y={scoutY} scale={1.45} wingT={frame} goggles label="SCOUT" />
              {frame >= 407 && (
                <>
                  <BeeChar x={scoutX - 240} y={scoutY - 120} scale={1.25} wingT={frame + 3} label="WORKER A" />
                  <BeeChar x={scoutX - 260} y={scoutY + 130} scale={1.25} wingT={frame + 7} label="WORKER B" />
                </>
              )}
            </>
          ) : (
            <>
              {/* Inside Golden Honeycomb Hive */}
              <rect width="1920" height="1080" fill="#f59e0b" />
              <rect width="1920" height="1080" fill="#451a03" opacity="0.22" />
              {[0, 1, 2, 3, 4, 5].map((r) =>
                [0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
                  <polygon
                    key={`${r}-${c}`}
                    points="0,-65 56,-32 56,32 0,65 -56,32 -56,-32"
                    transform={`translate(${140 + c * 240 + (r % 2) * 120}, ${140 + r * 185})`}
                    fill="#d97706"
                    stroke="#78350f"
                    strokeWidth="6"
                    opacity="0.45"
                  />
                ))
              )}

              {/* Figure-8 Waggle Path */}
              {isDance && (
                <g>
                  <path
                    d="M 960,520 C 720,330 720,710 960,520 C 1200,330 1200,710 960,520 Z"
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="12"
                    strokeDasharray="24 14"
                  />
                  {/* Sun Angle Indicator */}
                  <g transform="translate(1540, 250)">
                    <circle r="76" fill="#fde047" stroke="#241726" strokeWidth="6" />
                    <line x1="0" y1="0" x2="-150" y2="110" stroke="#fff" strokeWidth="8" strokeDasharray="12 10" />
                    <text x="0" y="110" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="900">42° TO SUN</text>
                  </g>
                </g>
              )}

              {/* 4 Bee Characters in Hive */}
              <BeeChar x={320} y={420} scale={1.35} wingT={frame} crown label="QUEEN" />
              <BeeChar x={350} y={690} scale={1.2} wingT={frame + 4} goggles={frame >= 304} label="WORKER A" />
              <BeeChar x={1560} y={670} scale={1.2} flip wingT={frame + 9} goggles={frame >= 304} label="WORKER B" />
              <BeeChar x={scoutX} y={scoutY} scale={1.55} wingT={frame * 1.4} goggles label="SCOUT" />
            </>
          )}
        </svg>
      </div>

      {/* Headline Banner */}
      <div style={{ position: "absolute", top: 44, left: "50%", transform: `translateX(-50%) scale(${titlePop})`, background: "#241726", color: "#fde047", padding: "12px 34px", borderRadius: 999, fontSize: 30, fontWeight: 900, border: "4px solid #fde047" }}>
        STYLE 2 · HONEYBEE WAGGLE GPS
      </div>

      {frame >= 415 && (
        <div style={{ position: "absolute", top: 140, left: "50%", transform: `translateX(-50%) scale(${badgePop})`, background: "#ffd32a", color: "#241726", border: "5px solid #241726", borderRadius: 18, padding: "12px 32px", fontSize: 32, fontWeight: 900 }}>
          ZERO SATELLITES NEEDED!
        </div>
      )}

      <WordSubtitles words={words} accentColor="#fde047" bottom={44} />
    </AbsoluteFill>
  );
};
