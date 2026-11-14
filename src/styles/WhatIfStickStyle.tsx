import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordSubtitles, WordTiming } from "../components/WordSubtitles";
import wordsData from "../data/words_style1.json";

const words = wordsData as WordTiming[];

const Scene1Room: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titlePop = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const sipBob = Math.sin(frame * 0.12) * 6;
  const lampPulse = 0.88 + Math.sin(frame * 0.2) * 0.06;
  const badgePop = spring({ frame: Math.max(0, frame - 95), fps, config: { damping: 12, stiffness: 190 } });
  const timer = Math.max(0, 5 - Math.floor((frame - 180) / 30));

  return (
    <AbsoluteFill style={{ backgroundColor: "#141824" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <radialGradient id="lampGlow1" cx="76%" cy="34%" r="48%">
            <stop offset="0%" stopColor="#ffb86c" stopOpacity={0.55 * lampPulse} />
            <stop offset="100%" stopColor="#141824" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="#1b2136" />
        <polygon points="0,780 1920,780 1920,1080 0,1080" fill="#181b2c" />
        <rect width="1920" height="1080" fill="url(#lampGlow1)" />
        {/* Window */}
        <g transform="translate(180, 180)">
          <rect width="340" height="390" rx="8" fill="#2c3a67" stroke="#10131f" strokeWidth="10" />
          <circle cx="255" cy="85" r="36" fill="#ffd9a0" opacity="0.85" />
          <line x1="170" y1="0" x2="170" y2="390" stroke="#10131f" strokeWidth="8" />
          <line x1="0" y1="195" x2="340" y2="195" stroke="#10131f" strokeWidth="8" />
        </g>
        {/* Lamp & Desk */}
        <g transform="translate(1420, 420)">
          <rect x="-8" y="0" width="16" height="360" fill="#0e111a" />
          <polygon points="-70,0 70,0 45,-75 -45,-75" fill="#ffb86c" stroke="#0e111a" strokeWidth="6" />
        </g>
        <rect x="1120" y="690" width="440" height="24" rx="6" fill="#3a2e39" stroke="#0e111a" strokeWidth="5" />
        <rect x="1240" y={638 + sipBob * 0.4} width="46" height="52" rx="8" fill="#f4f1ea" stroke="#0e111a" strokeWidth="5" />
        {/* Pip */}
        <g transform={`translate(860, ${600 + sipBob})`}>
          <line x1="0" y1="-20" x2="0" y2="95" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
          <circle cx="0" cy="-70" r="46" fill="#f8fafc" stroke="#0e111a" strokeWidth="6" />
          <circle cx="-14" cy="-74" r="6" fill="#0e111a" />
          <circle cx="16" cy="-74" r="6" fill="#0e111a" />
          <path d="M-12,-50 Q2,-40 16,-50" fill="none" stroke="#0e111a" strokeWidth="5" strokeLinecap="round" />
          <line x1="0" y1="5" x2="-52" y2="58" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" />
          <line x1="0" y1="5" x2="52" y2="58" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" />
          <line x1="0" y1="95" x2="-32" y2="185" stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" />
          <line x1="0" y1="95" x2="32" y2="185" stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" />
        </g>
        <g transform={`translate(960, 140) scale(${titlePop})`}>
          <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="64" fontWeight="900">WHAT IF EARTH STOPPED</text>
          <text x="0" y="68" textAnchor="middle" fill="#ffb86c" fontSize="50" fontWeight="800">SPINNING FOR 5 SECONDS?</text>
        </g>
        {frame >= 95 && (
          <g transform={`translate(460, 320) scale(${badgePop})`}>
            <rect x="-175" y="-38" width="350" height="76" rx="16" fill="#ff7b54" />
            <text x="0" y="10" textAnchor="middle" fill="#141824" fontSize="30" fontWeight="900">EQUATOR: 1,670 KM/H</text>
          </g>
        )}
        {frame >= 180 && (
          <g transform="translate(1520, 230)">
            <circle r="68" fill="#1e293b" stroke="#ffb86c" strokeWidth="6" />
            <text x="0" y="18" textAnchor="middle" fill="#ffb86c" fontSize="56" fontWeight="900">{timer}s</text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

const Scene2GlobeAndLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spin = interpolate(frame, [0, 140], [0, 360]);
  const brake = frame >= 140;
  const launchX = brake ? interpolate(frame, [140, 260], [0, 950], { extrapolateRight: "clamp" }) : 0;
  const speedPop = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 12, stiffness: 180 } });
  const machPop = spring({ frame: Math.max(0, frame - 210), fps, config: { damping: 12, stiffness: 190 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {/* Globe */}
        <g transform="translate(500, 480)">
          <circle r="240" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="8" />
          <ellipse cx="0" cy="0" rx="240" ry="70" fill="none" stroke="#ffb86c" strokeWidth="5" strokeDasharray="16 12" />
          <g transform={`rotate(${brake ? 0 : spin})`}>
            <path d="M-90,-120 Q-20,-160 50,-90 Q90,-20 20,60 Q-70,90 -110,-10 Z" fill="#22c55e" opacity="0.85" />
          </g>
          {!brake && (
            <path d="M270,-50 L350,0 L270,50" fill="none" stroke="#ffb86c" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </g>

        {/* Speedometer */}
        <g transform={`translate(500, 150) scale(${speedPop})`}>
          <rect x="-220" y="-42" width="440" height="84" rx="18" fill={brake ? "#ef4444" : "#1e293b"} stroke="#ffb86c" strokeWidth="4" />
          <text x="0" y="12" textAnchor="middle" fill="#ffffff" fontSize="34" fontWeight="900">
            {brake ? "EARTH: 0 KM/H (BRAKED!)" : "SURFACE: 1,670 KM/H →"}
          </text>
        </g>

        {/* Pip & Mug Launching Sideways */}
        <g transform={`translate(${1080 + launchX}, ${540 - launchX * 0.12}) rotate(${brake ? 72 : 0})`}>
          <line x1="0" y1="-20" x2="0" y2="95" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
          <circle cx="0" cy="-70" r="46" fill="#f8fafc" stroke="#0e111a" strokeWidth="6" />
          <circle cx="-14" cy="-74" r="6" fill="#0e111a" />
          <circle cx="16" cy="-74" r="6" fill="#0e111a" />
          <ellipse cx="2" cy="-48" rx="11" ry="14" fill="#0e111a" />
          <line x1="0" y1="5" x2="-70" y2="-45" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" />
          <line x1="0" y1="5" x2="70" y2="-45" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" />
          <line x1="0" y1="95" x2="-40" y2="175" stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" />
          <line x1="0" y1="95" x2="40" y2="175" stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" />
        </g>

        {brake && (
          <g transform={`translate(1420, 290) scale(${machPop})`}>
            <rect x="-210" y="-44" width="420" height="88" rx="18" fill="#ff7b54" />
            <text x="0" y="10" textAnchor="middle" fill="#141824" fontSize="32" fontWeight="900">MACH 1.35 SIDEWAYS!</text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

const Scene3OceansAndWinds: React.FC = () => {
  const frame = useCurrentFrame();
  const waveX = interpolate(frame, [0, 420], [-200, 900]);
  const windOffset = (frame * 36) % 1920;

  return (
    <AbsoluteFill style={{ backgroundColor: "#161b2e" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {/* City Silhouette */}
        {[120, 320, 500, 720, 940, 1180, 1420, 1650].map((x, i) => (
          <rect key={i} x={x} y={480 + (i % 3) * 60} width="130" height={420} fill="#252d4a" stroke="#0f1320" strokeWidth="5" />
        ))}
        {/* Supersonic Wind Streaks */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={(windOffset + i * 380) % 2100 - 200} y={170 + i * 115} width="260" height="10" rx="5" fill="#93c5fd" opacity="0.55" />
        ))}
        {/* Colossal Ocean Surge */}
        <path
          d={`M ${waveX - 900},900 Q ${waveX + 200},310 ${waveX + 420},540 Q ${waveX + 520},660 ${waveX + 350},900 Z`}
          fill="#2563eb"
          opacity="0.88"
          stroke="#93c5fd"
          strokeWidth="8"
        />
        <rect x="0" y="880" width="1920" height="200" fill="#1e3a8a" />
        <g transform="translate(960, 150)">
          <rect x="-320" y="-45" width="640" height="90" rx="20" fill="#1e293b" stroke="#60a5fa" strokeWidth="4" />
          <text x="0" y="12" textAnchor="middle" fill="#f8fafc" fontSize="36" fontWeight="900">SUPERSONIC WINDS + MEGA TSUNAMIS</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const Scene4NorthPoleTwist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spin = frame * 4;
  const cardPop = spring({ frame: Math.max(0, frame - 180), fps, config: { damping: 14, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1b2845" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {/* Snowy Ground */}
        <rect x="0" y="760" width="1920" height="320" fill="#e2e8f0" />
        {/* North Pole Sign */}
        <g transform="translate(1360, 480)">
          <rect x="-12" y="0" width="24" height="290" fill="#7f1d1d" />
          <rect x="-140" y="-40" width="280" height="80" rx="12" fill="#ef4444" stroke="#ffffff" strokeWidth="5" />
          <text x="0" y="12" textAnchor="middle" fill="#ffffff" fontSize="30" fontWeight="900">NORTH POLE: 0 KM/H</text>
        </g>
        {/* Pip spinning gently in place */}
        <g transform={`translate(760, 600) rotate(${Math.sin(spin * 0.05) * 10})`}>
          <ellipse cx="0" cy="185" rx="58" ry="12" fill="#94a3b8" />
          <line x1="0" y1="-20" x2="0" y2="95" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" />
          <circle cx="0" cy="-70" r="46" fill="#ffffff" stroke="#0f172a" strokeWidth="6" />
          <circle cx="-14" cy="-74" r="6" fill="#0f172a" />
          <circle cx="16" cy="-74" r="6" fill="#0f172a" />
          <path d="M-14,-48 Q0,-36 14,-48" fill="none" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
          <line x1="0" y1="5" x2="-55" y2="48" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" />
          <line x1="0" y1="5" x2="55" y2="48" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" />
          <line x1="0" y1="95" x2="-30" y2="180" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" />
          <line x1="0" y1="95" x2="30" y2="180" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" />
        </g>
        <g transform={`translate(960, 170) scale(${cardPop})`}>
          <rect x="-360" y="-48" width="720" height="96" rx="20" fill="#22c55e" />
          <text x="0" y="12" textAnchor="middle" fill="#052e16" fontSize="38" fontWeight="900">SAFE ZONE: JUST SPIN IN PLACE!</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const WhatIfStickStyle: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
    <Audio src={staticFile("audio/style1_master.wav")} />
    <Sequence from={0} durationInFrames={360}><Scene1Room /></Sequence>
    <Sequence from={360} durationInFrames={420}><Scene2GlobeAndLaunch /></Sequence>
    <Sequence from={780} durationInFrames={420}><Scene3OceansAndWinds /></Sequence>
    <Sequence from={1200} durationInFrames={600}><Scene4NorthPoleTwist /></Sequence>
    <WordSubtitles words={words} accentColor="#ffb86c" />
  </AbsoluteFill>
);
