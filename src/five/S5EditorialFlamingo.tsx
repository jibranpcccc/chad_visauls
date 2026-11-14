import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordSubtitles, WordTiming } from "../components/WordSubtitles";
import wordsData from "../data/five_s5_words.json";

const words = wordsData as WordTiming[];

const FlamingoCutout: React.FC<{ x: number; y: number; scale?: number; color: string; headDip?: number }> = ({ x, y, scale = 1, color, headDip = 0 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} style={{ filter: "drop-shadow(0 16px 20px rgba(30,41,59,0.22))" }}>
    {/* Standing + Bent Leg */}
    <line x1="-10" y1="70" x2="-10" y2="230" stroke="#EA580C" strokeWidth="10" strokeLinecap="round" />
    <path d="M18,70 L54,140 L10,165" fill="none" stroke="#EA580C" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    {/* Oval Body */}
    <ellipse cx="0" cy="20" rx="88" ry="58" fill={color} />
    <ellipse cx="-16" cy="14" rx="54" ry="34" fill="#FFFFFF" opacity="0.22" />
    {/* S-Curved Neck + Head */}
    <path d={`M64,0 C110,-60 40,${-145 + headDip} 92,${-190 + headDip}`} fill="none" stroke={color} strokeWidth="26" strokeLinecap="round" />
    <circle cx="96" cy={-196 + headDip} r="28" fill={color} />
    {/* Beak */}
    <path d={`M118,${-200 + headDip} Q156,${-195 + headDip} 148,${-162 + headDip} L118,${-178 + headDip} Z`} fill="#1E293B" />
    <circle cx="102" cy={-202 + headDip} r="5" fill="#1E293B" />
  </g>
);

const BabyChick: React.FC<{ x: number; y: number; bob: number }> = ({ x, y, bob }) => (
  <g transform={`translate(${x}, ${y + bob})`} style={{ filter: "drop-shadow(0 10px 14px rgba(30,41,59,0.2))" }}>
    <line x1="-14" y1="42" x2="-14" y2="105" stroke="#FB7185" strokeWidth="8" strokeLinecap="round" />
    <line x1="14" y1="42" x2="14" y2="105" stroke="#FB7185" strokeWidth="8" strokeLinecap="round" />
    <circle cx="0" cy="0" r="54" fill="#CBD5E1" />
    <circle cx="24" cy="-46" r="34" fill="#E2E8F0" />
    <polygon points="52,-48 76,-40 52,-32" fill="#334155" />
    <circle cx="34" cy="-52" r="5" fill="#1E293B" />
  </g>
);

export const S5EditorialFlamingo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beats: B1(8-110), B2(110-205), B3(205-321), B4(321-439), B5(439-539)
  const bob = Math.sin(frame * 0.16) * 8;
  const pinkMix = frame >= 321 ? interpolate(frame, [321, 430], [0, 1], { extrapolateRight: "clamp" }) : frame < 110 ? 0 : 0.35;
  const adultColor = pinkMix < 0.5 ? "#94A3B8" : "#FF5D73";
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 170 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#F5EFE6", color: "#1E293B", fontFamily: "Georgia, 'Times New Roman', serif", overflow: "hidden" }}>
      <Audio src={staticFile("five/s5_master.wav")} />

      {/* Warm Paper-Cut Layered Backdrop */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {/* Sun Cutout */}
        <circle cx="1620" cy="210" r="130" fill="#FACC15" opacity="0.88" />
        {/* Layered Paper Dunes / Lagoon */}
        <path d="M0,740 Q480,660 960,740 T1920,720 L1920,1080 L0,1080 Z" fill="#99F6E4" />
        <path d="M0,810 Q560,760 1120,830 T1920,790 L1920,1080 L0,1080 Z" fill="#0F766E" opacity="0.85" />

        {/* Editorial Header */}
        <g transform={`translate(90, 90) scale(${pop})`}>
          <rect x="0" y="-42" width="380" height="50" rx="8" fill="#1E293B" />
          <text x="190" y="-9" textAnchor="middle" fill="#F5EFE6" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="800" letterSpacing="2">
            STYLE 5 · PAPER EDITORIAL
          </text>
          <text x="0" y="64" fill="#1E293B" fontSize="64" fontWeight="900">Why Flamingos Are Born Grey</text>
        </g>

        {/* Beat 3: Brine Shrimp & Carotenoid Magnifier */}
        {frame >= 205 && frame < 360 && (
          <g transform="translate(960, 440)">
            <circle r="170" fill="#FFF7ED" stroke="#FF5D73" strokeWidth="10" style={{ filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.12))" }} />
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${(i - 1) * 75}, ${Math.sin(frame * 0.2 + i) * 24})`}>
                <path d="M-24,0 Q0,-26 28,-6 Q12,18 -24,0 Z" fill="#F97316" />
                <circle cx="18" cy="-4" r="4" fill="#1E293B" />
              </g>
            ))}
            <text x="0" y="110" textAnchor="middle" fill="#EA580C" fontFamily="system-ui, sans-serif" fontSize="28" fontWeight="900">CAROTENOIDS</text>
          </g>
        )}

        {/* Grey Baby Chick + Adult Transforming Pink Flamingo */}
        <BabyChick x={540} y={640} bob={bob} />
        <FlamingoCutout x={1280} y={530} scale={1.15} color={adultColor} headDip={Math.sin(frame * 0.1) * 14} />

        {/* Editorial Fact Badge */}
        <g transform="translate(960, 260)">
          <rect x="-280" y="-36" width="560" height="72" rx="14" fill={pinkMix >= 0.5 ? "#FF5D73" : "#334155"} />
          <text x="0" y="11" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontSize="30" fontWeight="900">
            {frame < 205 ? "HATCHED 100% GREY" : frame < 321 ? "BRINE SHRIMP + ALGAE PIGMENT" : "CORAL PINK FROM DIET!"}
          </text>
        </g>
      </svg>

      <WordSubtitles words={words} accentColor="#FF5D73" bottom={44} />
    </AbsoluteFill>
  );
};
