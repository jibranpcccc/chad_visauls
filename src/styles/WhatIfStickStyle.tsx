import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Style 1: Dusk-lit 2D SVG Stick-Figure "What If" style */
export const WhatIfStickStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titlePop = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const floatStart = 35;
  const isFloating = frame >= floatStart && frame < 115;

  const charY = isFloating
    ? interpolate(frame, [floatStart, 75, 115], [0, -140, -110], { extrapolateRight: "clamp" })
    : frame >= 115
      ? interpolate(frame, [115, 128], [-110, 0], { extrapolateRight: "clamp" })
      : 0;

  const charRot = isFloating
    ? Math.sin((frame - floatStart) * 0.14) * 14
    : 0;

  const cupY = isFloating
    ? interpolate(frame, [floatStart + 6, 80, 115], [0, -190, -165], { extrapolateRight: "clamp" })
    : frame >= 115
      ? interpolate(frame, [115, 128], [-165, 0], { extrapolateRight: "clamp" })
      : 0;

  const lampFlicker = 0.88 + Math.sin(frame * 0.25) * 0.06;
  const badgeScale = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 12, stiffness: 200 } });
  const factScale = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 14, stiffness: 170 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#141824", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <radialGradient id="lampGlow" cx="76%" cy="34%" r="48%">
            <stop offset="0%" stopColor="#ffb86c" stopOpacity={0.55 * lampFlicker} />
            <stop offset="55%" stopColor="#ff7b54" stopOpacity={0.14 * lampFlicker} />
            <stop offset="100%" stopColor="#141824" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="duskWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b2136" />
            <stop offset="100%" stopColor="#262b44" />
          </linearGradient>
        </defs>

        {/* Perspective Room */}
        <rect width="1920" height="1080" fill="url(#duskWall)" />
        <polygon points="0,780 1920,780 1920,1080 0,1080" fill="#181b2c" />
        <line x1="0" y1="780" x2="1920" y2="780" stroke="#363e63" strokeWidth="4" />

        {/* Dusk Window */}
        <g transform="translate(210, 190)">
          <rect width="340" height="390" rx="8" fill="#2c3a67" stroke="#10131f" strokeWidth="10" />
          <rect x="14" y="14" width="312" height="362" fill="#465896" opacity="0.55" />
          <circle cx="255" cy="85" r="36" fill="#ffd9a0" opacity="0.85" />
          <line x1="170" y1="0" x2="170" y2="390" stroke="#10131f" strokeWidth="8" />
          <line x1="0" y1="195" x2="340" y2="195" stroke="#10131f" strokeWidth="8" />
        </g>

        {/* Warm Lamp */}
        <rect width="1920" height="1080" fill="url(#lampGlow)" />
        <g transform="translate(1420, 420)">
          <rect x="-8" y="0" width="16" height="360" fill="#0e111a" />
          <polygon points="-70,0 70,0 45,-75 -45,-75" fill="#ffb86c" stroke="#0e111a" strokeWidth="6" />
          <ellipse cx="0" cy="360" rx="75" ry="14" fill="#0e111a" />
        </g>

        {/* Desk + Floating Coffee Cup */}
        <rect x="1120" y="690" width="440" height="24" rx="6" fill="#3a2e39" stroke="#0e111a" strokeWidth="5" />
        <rect x="1150" y="714" width="20" height="90" fill="#231c24" />
        <rect x="1510" y="714" width="20" height="90" fill="#231c24" />

        <g transform={`translate(1240, ${638 + cupY}) rotate(${isFloating ? -18 : 0})`}>
          <rect x="0" y="0" width="46" height="52" rx="8" fill="#f4f1ea" stroke="#0e111a" strokeWidth="5" />
          <path d="M46,12 C64,12 64,40 46,40" fill="none" stroke="#f4f1ea" strokeWidth="6" />
        </g>

        {/* Stick-Figure Rig ("Pip") */}
        <g transform={`translate(860, ${600 + charY}) rotate(${charRot})`}>
          {/* Shadow */}
          <ellipse cx="0" cy={190 - charY} rx={isFloating ? 38 : 64} ry="12" fill="#090b12" opacity="0.55" />
          {/* Body */}
          <line x1="0" y1="-20" x2="0" y2="95" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" />
          {/* Head */}
          <circle cx="0" cy="-70" r="46" fill="#f8fafc" stroke="#0e111a" strokeWidth="6" />
          {/* Eyes */}
          <circle cx="-14" cy="-74" r="6" fill="#0e111a" />
          <circle cx="16" cy="-74" r="6" fill="#0e111a" />
          {/* Expression */}
          {isFloating ? (
            <ellipse cx="2" cy="-48" rx="10" ry="13" fill="#0e111a" />
          ) : (
            <path d="M-12,-50 Q2,-40 16,-50" fill="none" stroke="#0e111a" strokeWidth="5" strokeLinecap="round" />
          )}
          {/* Arms */}
          <line
            x1="0"
            y1="5"
            x2={isFloating ? -78 : -52}
            y2={isFloating ? -45 : 58}
            stroke="#f8fafc"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="5"
            x2={isFloating ? 78 : 52}
            y2={isFloating ? -45 : 58}
            stroke="#f8fafc"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Legs */}
          <line x1="0" y1="95" x2={isFloating ? -45 : -32} y2={isFloating ? 172 : 185} stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" />
          <line x1="0" y1="95" x2={isFloating ? 45 : 32} y2={isFloating ? 172 : 185} stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" />
        </g>

        {/* Top Style Tag */}
        <g transform="translate(70, 60)">
          <rect width="380" height="52" rx="26" fill="#ffb86c" />
          <text x="190" y="34" textAnchor="middle" fill="#141824" fontSize="22" fontWeight="800" letterSpacing="1.5">
            STYLE 1: WHAT-IF SVG
          </text>
        </g>

        {/* Kinetic Title Card */}
        <g transform={`translate(960, 145) scale(${titlePop})`}>
          <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="62" fontWeight="900">
            WHAT IF GRAVITY STOPPED
          </text>
          <text x="0" y="66" textAnchor="middle" fill="#ffb86c" fontSize="48" fontWeight="800">
            FOR 3 SECONDS?
          </text>
        </g>

        {/* Micro-event Callouts */}
        {frame >= 50 && (
          <g transform={`translate(460, 320) scale(${badgeScale})`}>
            <rect x="-150" y="-36" width="300" height="72" rx="16" fill="#ff7b54" />
            <text x="0" y="10" textAnchor="middle" fill="#141824" fontSize="30" fontWeight="900">
              0.00 G DETECTED
            </text>
          </g>
        )}
        {frame >= 90 && (
          <g transform={`translate(1430, 260) scale(${factScale})`}>
            <rect x="-210" y="-44" width="420" height="88" rx="16" fill="#1e293b" stroke="#ffb86c" strokeWidth="4" />
            <text x="0" y="-4" textAnchor="middle" fill="#f8fafc" fontSize="24" fontWeight="700">
              Earth spins at 1,670 km/h
            </text>
            <text x="0" y="28" textAnchor="middle" fill="#ffb86c" fontSize="22" fontWeight="700">
              You’d drift sideways instantly!
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
