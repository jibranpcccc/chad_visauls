import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Style 2: 2D Bean-Head Cartoon in Painted 3D-feel Toon World */
export const Cartoon3DToonStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camZoom = interpolate(frame, [0, 150], [1.0, 1.12]);
  const marchBob = Math.abs(Math.sin(frame * 0.28)) * 18;
  const bridgeDip = frame > 75 ? Math.sin((frame - 75) * 0.35) * 16 : 0;
  const popIn = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 190 } });
  const alertPop = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 10, stiffness: 220 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${camZoom})`, transformOrigin: "center 55%" }}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%">
          <defs>
            <linearGradient id="toonSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3e7fd2" />
              <stop offset="100%" stopColor="#b8d0ec" />
            </linearGradient>
            <filter id="dofBlur">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>

          {/* Saturated Sky */}
          <rect width="1920" height="1080" fill="url(#toonSky)" />

          {/* Soft Painted Clouds */}
          <g fill="#ffffff" opacity="0.88" transform={`translate(${frame * 0.4}, 0)`}>
            <ellipse cx="320" cy="190" rx="140" ry="48" />
            <ellipse cx="390" cy="175" rx="95" ry="52" />
            <ellipse cx="1450" cy="230" rx="170" ry="54" />
            <ellipse cx="1540" cy="210" rx="100" ry="50" />
          </g>

          {/* Distant Painted Town (DOF blurred) */}
          <g filter="url(#dofBlur)" opacity="0.85">
            <rect x="110" y="450" width="180" height="270" fill="#c97a63" stroke="#030303" strokeWidth="6" />
            <polygon points="90,450 200,360 310,450" fill="#7c4234" stroke="#030303" strokeWidth="6" />
            <rect x="340" y="490" width="150" height="230" fill="#e2c799" stroke="#030303" strokeWidth="6" />
            <rect x="1440" y="460" width="190" height="260" fill="#d99b66" stroke="#030303" strokeWidth="6" />
            <polygon points="1420,460 1535,375 1650,460" fill="#8b4738" stroke="#030303" strokeWidth="6" />
          </g>

          {/* River */}
          <rect x="0" y="790" width="1920" height="290" fill="#467eb8" />
          <line x1="0" y1="790" x2="1920" y2="790" stroke="#030303" strokeWidth="6" />

          {/* Suspension Bridge Deck */}
          <g transform={`translate(0, ${bridgeDip})`}>
            <rect x="180" y="685" width="1560" height="44" rx="8" fill="#b87c4c" stroke="#030303" strokeWidth="7" />
            <line x1="280" y1="685" x2="280" y2="420" stroke="#2f3542" strokeWidth="18" />
            <line x1="1640" y1="685" x2="1640" y2="420" stroke="#2f3542" strokeWidth="18" />
            <path d="M 280,430 Q 960,640 1640,430" fill="none" stroke="#1e272e" strokeWidth="8" />
          </g>

          {/* Bean-Head Cartoon Characters (Plum Ink #241726) */}
          {[0, 1, 2].map((idx) => {
            const x = 660 + idx * 280;
            const y = 550 - marchBob + bridgeDip;
            return (
              <g key={idx} transform={`translate(${x}, ${y})`}>
                {/* Body */}
                <rect x="-26" y="25" width="52" height="72" rx="18" fill="#c0392b" stroke="#241726" strokeWidth="8" />
                {/* Bean Head */}
                <rect x="-42" y="-58" width="84" height="78" rx="38" fill="#fde3c8" stroke="#241726" strokeWidth="8" />
                {/* Shako Hat */}
                <rect x="-32" y="-108" width="64" height="54" rx="10" fill="#1e272e" stroke="#241726" strokeWidth="7" />
                {/* Eyes */}
                <circle cx="-14" cy="-22" r="6" fill="#241726" />
                <circle cx="14" cy="-22" r="6" fill="#241726" />
                {/* Stick Legs */}
                <line x1="-14" y1="97" x2="-18" y2="138" stroke="#241726" strokeWidth="10" strokeLinecap="round" />
                <line x1="14" y1="97" x2="18" y2="138" stroke="#241726" strokeWidth="10" strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Overlay UI (unscaled) */}
      <div style={{ position: "absolute", top: 56, left: 70, background: "#241726", color: "#fff", padding: "12px 28px", borderRadius: 28, fontWeight: 800, fontSize: 22, letterSpacing: 1.4 }}>
        STYLE 2: CARTOON 3D TOON
      </div>

      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          transform: `scale(${popIn})`,
          color: "#ffffff",
          textShadow: "0 6px 0 #241726, 0 12px 24px rgba(0,0,0,0.45)",
          fontSize: 64,
          fontWeight: 900,
        }}
      >
        74 SOLDIERS BROKE A BRIDGE
      </div>

      {frame >= 80 && (
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: "50%",
            transform: `translateX(-50%) scale(${alertPop})`,
            background: "#ffd32a",
            color: "#241726",
            border: "6px solid #241726",
            borderRadius: 20,
            padding: "16px 38px",
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          RESONANCE FREQUENCY HIT!
        </div>
      )}
    </AbsoluteFill>
  );
};
