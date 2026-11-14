import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordSubtitles, WordTiming } from "../components/WordSubtitles";
import wordsData from "../data/five_s4_words.json";

const words = wordsData as WordTiming[];

const EngineerBot: React.FC<{ x: number; y: number; flip?: boolean; wave: number; color: string }> = ({ x, y, flip, wave, color }) => (
  <g transform={`translate(${x}, ${y}) scale(${flip ? -1 : 1}, 1)`}>
    {/* Hardhat */}
    <path d="M-36,-62 Q0,-105 36,-62 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="5" />
    {/* Head / Visor */}
    <rect x="-32" y="-62" width="64" height="48" rx="14" fill="#1E293B" stroke={color} strokeWidth="4" />
    <rect x="-22" y="-50" width="44" height="22" rx="8" fill={color} opacity="0.9" />
    {/* Body */}
    <rect x="-26" y="-10" width="52" height="68" rx="12" fill="#334155" stroke={color} strokeWidth="4" />
    {/* Waving Arm */}
    <line x1="26" y1="6" x2="58" y2={-18 + Math.sin(wave * 0.25) * 18} stroke={color} strokeWidth="10" strokeLinecap="round" />
    <line x1="-26" y1="6" x2="-48" y2="34" stroke={color} strokeWidth="10" strokeLinecap="round" />
    {/* Legs */}
    <line x1="-12" y1="58" x2="-14" y2="96" stroke="#94A3B8" strokeWidth="11" strokeLinecap="round" />
    <line x1="12" y1="58" x2="14" y2="96" stroke="#94A3B8" strokeWidth="11" strokeLinecap="round" />
  </g>
);

export const S4ByteForensicsChip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beats: B1(8-122), B2(122-233), B3(233-327), B4(327-444), B5(444-550)
  const packetX = (frame * 18) % 1600;
  const towers = [
    { label: "14nm", h: 160, color: "#64748B", val: "1.0x" },
    { label: "10nm", h: 250, color: "#38BDF8", val: "1.8x" },
    { label: "7nm", h: 360, color: "#818CF8", val: "3.1x" },
    { label: "3nm", h: 500, color: "#4ADE80", val: "5.0x" },
  ];
  const thermPct = frame >= 233 ? interpolate(frame, [233, 320], [92, 34], { extrapolateRight: "clamp" }) : 92;
  const counterB = frame >= 444 ? Math.round(interpolate(frame, [444, 525], [10, 100], { extrapolateRight: "clamp" })) : 10;
  const finRise = frame >= 327 ? spring({ frame: frame - 327, fps, config: { damping: 14, stiffness: 150 } }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#09111E", color: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif", overflow: "hidden" }}>
      <Audio src={staticFile("five/s4_master.wav")} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {/* PCB Circuit Bus */}
        <g opacity="0.45">
          {[140, 260, 820, 920].map((y, idx) => (
            <g key={idx}>
              <line x1="0" y1={y} x2="1920" y2={y} stroke="#1E3A5F" strokeWidth="4" />
              <circle cx={(packetX + idx * 380) % 1920} cy={y} r="8" fill="#22D3EE" />
            </g>
          ))}
        </g>

        {/* Top Chapter */}
        <g transform="translate(80, 56)">
          <rect width="460" height="52" rx="12" fill="#0F172A" stroke="#22D3EE" strokeWidth="3" />
          <text x="230" y="34" textAnchor="middle" fill="#22D3EE" fontFamily="monospace" fontSize="22" fontWeight="800">
            BYTE FORENSICS // 3nm SILICON
          </text>
        </g>

        {/* Beat 1: Hair vs 3nm */}
        {frame < 122 && (
          <g>
            <text x="960" y="210" textAnchor="middle" fill="#fff" fontSize="62" fontWeight="900">80,000 nm HAIR vs 3 nm GATE</text>
            <rect x="260" y="330" width="1400" height="110" rx="55" fill="#78350F" stroke="#FBBF24" strokeWidth="6" />
            <text x="960" y="400" textAnchor="middle" fill="#FEF3C7" fontSize="34" fontWeight="900">HUMAN HAIR (80,000 nm)</text>
            <rect x="920" y="540" width="80" height="80" rx="10" fill="#22D3EE" />
            <text x="960" y="680" textAnchor="middle" fill="#22D3EE" fontFamily="monospace" fontSize="40" fontWeight="900">3 nm TRANSISTOR (26,000x SMALLER)</text>
            <EngineerBot x={460} y={760} wave={frame} color="#22D3EE" />
            <EngineerBot x={1460} y={760} flip wave={frame + 10} color="#4ADE80" />
          </g>
        )}

        {/* Beat 2 & 3: 4-Tower Skyscraper Benchmark Arena + Vertical Thermometer */}
        {frame >= 122 && frame < 327 && (
          <g>
            <text x="720" y="180" textAnchor="middle" fill="#fff" fontSize="56" fontWeight="900">TRANSISTOR DENSITY ARENA</text>
            <line x1="180" y1="810" x2="1260" y2="810" stroke="#334155" strokeWidth="6" />
            {towers.map((tw, i) => {
              const grow = spring({ frame: Math.max(0, frame - 122 - i * 10), fps, config: { damping: 14, stiffness: 160 } });
              const h = tw.h * grow;
              const x = 250 + i * 250;
              return (
                <g key={tw.label}>
                  <rect x={x} y={810 - h} width="150" height={h} rx="12" fill={tw.color} />
                  <text x={x + 75} y={790 - h} textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="32" fontWeight="900">{tw.val}</text>
                  <text x={x + 75} y={860} textAnchor="middle" fill="#CBD5E1" fontFamily="monospace" fontSize="30" fontWeight="800">{tw.label}</text>
                </g>
              );
            })}

            {/* Vertical Thermal Thermometer Tube */}
            <g transform="translate(1520, 220)">
              <rect x="-45" y="0" width="90" height="540" rx="45" fill="#0F172A" stroke="#38BDF8" strokeWidth="5" />
              <rect x="-25" y={520 - thermPct * 4.8} width="50" height={thermPct * 4.8} rx="25" fill={thermPct > 60 ? "#EF4444" : "#22D3EE"} />
              <text x="0" y="-24" textAnchor="middle" fill="#38BDF8" fontFamily="monospace" fontSize="24" fontWeight="800">HEAT / POWER</text>
              <text x="0" y="595" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="36" fontWeight="900">{Math.round(thermPct)}°C</text>
            </g>
          </g>
        )}

        {/* Beat 4 & 5: 3D Vertical FinFET Skyscrapers + 100B Counter */}
        {frame >= 327 && (
          <g>
            <text x="960" y="180" textAnchor="middle" fill="#4ADE80" fontSize="58" fontWeight="900">
              {frame >= 444 ? `${counterB},000,000,000+ SWITCHES` : "3D VERTICAL FINFET ARCHITECTURE"}
            </text>
            {/* Silicon Wafer Base */}
            <polygon points="360,720 1560,720 1720,840 200,840" fill="#1E293B" stroke="#22D3EE" strokeWidth="5" />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const fh = (220 + (i % 2) * 70) * finRise;
              return (
                <g key={i} transform={`translate(${440 + i * 190}, ${760 - fh})`}>
                  <rect width="74" height={fh} rx="8" fill={i % 2 ? "#22D3EE" : "#4ADE80"} stroke="#09111E" strokeWidth="4" />
                </g>
              );
            })}
            <EngineerBot x={260} y={700} wave={frame} color="#22D3EE" />
            <EngineerBot x={1660} y={700} flip wave={frame + 8} color="#4ADE80" />
          </g>
        )}
      </svg>

      <WordSubtitles words={words} accentColor="#4ADE80" bottom={44} />
    </AbsoluteFill>
  );
};
