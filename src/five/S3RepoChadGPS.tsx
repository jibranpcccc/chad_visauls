import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordSubtitles, WordTiming } from "../components/WordSubtitles";
import wordsData from "../data/five_s3_words.json";

const words = wordsData as WordTiming[];

export const S3RepoChadGPS: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beats: B1(8-124), B2(124-237), B3(237-344), B4(344-488), B5(488-592)
  const chapter =
    frame < 124 ? "01 // 31 GPS SATELLITES" :
    frame < 237 ? "02 // NANOSECOND DELAYS" :
    frame < 344 ? "03 // 4-SPHERE TRILATERATION" :
    frame < 488 ? "04 // EINSTEIN RELATIVITY FIX" :
    "05 // ±3M PRECISION LOCK";

  const chapterColor =
    frame < 124 ? "#22D3EE" :
    frame < 237 ? "#A855F7" :
    frame < 344 ? "#4ADE80" :
    frame < 488 ? "#FB923C" : "#22D3EE";

  const satAngle = frame * 0.025;
  const waveRadius = (frame * 6) % 240;
  const driftKm = frame >= 344 ? interpolate(frame, [344, 460], [0, 11.4], { extrapolateRight: "clamp" }) : 0;
  const cardPop = spring({ frame: frame >= 488 ? frame - 488 : frame, fps, config: { damping: 14, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0D13", color: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif", overflow: "hidden" }}>
      <Audio src={staticFile("five/s3_master.wav")} />

      {/* Obsidian Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Chapter Notch */}
      <div style={{ position: "absolute", top: 44, left: 64, display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(18,22,34,0.92)", border: `2px solid ${chapterColor}`, borderRadius: 999, padding: "10px 26px", fontFamily: "monospace", fontSize: 22, fontWeight: 800, color: chapterColor }}>
        <span>●</span> {chapter}
      </div>

      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "relative" }}>
        {/* Earth + Orbit Ring */}
        <g transform="translate(560, 520)">
          <circle r="310" fill="none" stroke="#1E293B" strokeWidth="4" strokeDasharray="12 10" />
          <circle r="150" fill="#0F172A" stroke="#22D3EE" strokeWidth="5" />
          <path d="M-70,-50 Q-10,-90 60,-40 Q80,30 10,80 Q-60,60 -70,-50 Z" fill="#10B981" opacity="0.6" />
          {/* Phone Pin Target */}
          <circle cx="30" cy="-20" r="14" fill="#4ADE80" />
          {frame >= 237 && <circle cx="30" cy="-20" r={30 + (frame % 30) * 2} fill="none" stroke="#4ADE80" strokeWidth="4" opacity={1 - (frame % 30) / 30} />}

          {/* 4 Orbiting Satellites */}
          {[0, 1, 2, 3].map((i) => {
            const a = satAngle + i * (Math.PI / 2);
            const sx = Math.cos(a) * 310;
            const sy = Math.sin(a) * 310;
            return (
              <g key={i}>
                {frame >= 124 && (
                  <circle cx={sx} cy={sy} r={waveRadius + 20} fill="none" stroke={i % 2 ? "#A855F7" : "#22D3EE"} strokeWidth="3" opacity={1 - waveRadius / 240} />
                )}
                <line x1={sx} y1={sy} x2={30} y2={-20} stroke={chapterColor} strokeWidth="2.5" strokeDasharray="8 8" opacity="0.55" />
                <g transform={`translate(${sx}, ${sy})`}>
                  <rect x="-26" y="-8" width="52" height="16" rx="3" fill="#22D3EE" />
                  <rect x="-12" y="-14" width="24" height="28" rx="4" fill="#F8FAFC" />
                </g>
              </g>
            );
          })}
        </g>

        {/* Right Side Neon Cards */}
        <g transform="translate(1060, 210)">
          {frame < 237 && (
            <>
              {[
                { label: "SAT-01 DELAY", val: "67,412,910 ns", c: "#22D3EE", y: 0 },
                { label: "SAT-02 DELAY", val: "71,084,220 ns", c: "#A855F7", y: 155 },
                { label: "SAT-03 DELAY", val: "64,901,550 ns", c: "#4ADE80", y: 310 },
                { label: "SAT-04 DELAY", val: "73,219,005 ns", c: "#FB923C", y: 465 },
              ].map((row, idx) => (
                <g key={idx} transform={`translate(0, ${row.y})`}>
                  <rect width="740" height="125" rx="20" fill="#121622" stroke={row.c} strokeWidth="3" />
                  <text x="32" y="48" fill={row.c} fontFamily="monospace" fontSize="22" fontWeight="800">{row.label}</text>
                  <text x="32" y="96" fill="#F8FAFC" fontFamily="monospace" fontSize="40" fontWeight="900">{row.val}</text>
                </g>
              ))}
            </>
          )}

          {frame >= 237 && frame < 344 && (
            <g>
              <rect width="740" height="540" rx="24" fill="#121622" stroke="#4ADE80" strokeWidth="3" />
              <text x="44" y="64" fill="#4ADE80" fontFamily="monospace" fontSize="24" fontWeight="800">4-SPHERE INTERSECTION</text>
              <text x="44" y="150" fill="#F8FAFC" fontSize="54" fontWeight="900">LOCKED ON TARGET</text>
              <text x="44" y="220" fill="#94A3B8" fontSize="30">3 spheres give 2 points.</text>
              <text x="44" y="270" fill="#94A3B8" fontSize="30">4th sphere eliminates time drift.</text>
              <rect x="44" y="340" width="650" height="140" rx="18" fill="#0B0D13" stroke="#22D3EE" strokeWidth="2" />
              <text x="369" y="428" textAnchor="middle" fill="#4ADE80" fontFamily="monospace" fontSize="52" fontWeight="900">ACCURACY: ± 3.0 m</text>
            </g>
          )}

          {frame >= 344 && frame < 488 && (
            <g>
              <rect width="740" height="540" rx="24" fill="#121622" stroke="#FB923C" strokeWidth="4" />
              <text x="44" y="64" fill="#FB923C" fontFamily="monospace" fontSize="24" fontWeight="800">EINSTEIN RELATIVITY OFFSET</text>
              <text x="44" y="155" fill="#F8FAFC" fontSize="54" fontWeight="900">+38 MICROSECONDS / DAY</text>
              <text x="44" y="230" fill="#94A3B8" fontSize="30">Without general + special relativity,</text>
              <text x="44" y="275" fill="#94A3B8" fontSize="30">your map drifts off the road fast:</text>
              <text x="370" y="430" textAnchor="middle" fill="#EF4444" fontFamily="monospace" fontSize="86" fontWeight="900">{driftKm.toFixed(1)} KM / DAY</text>
            </g>
          )}

          {frame >= 488 && (
            <g transform={`scale(${cardPop})`}>
              <rect width="740" height="540" rx="24" fill="#121622" stroke="#22D3EE" strokeWidth="4" />
              <text x="44" y="70" fill="#22D3EE" fontFamily="monospace" fontSize="24" fontWeight="800">GPS SUMMARY</text>
              <text x="44" y="170" fill="#4ADE80" fontSize="64" fontWeight="900">299,792 km/s</text>
              <text x="44" y="240" fill="#F8FAFC" fontSize="36" fontWeight="700">31 Satellites · 4-Sphere Lock</text>
              <text x="44" y="340" fill="#A855F7" fontSize="56" fontWeight="900">± 3 METERS</text>
              <text x="44" y="430" fill="#94A3B8" fontSize="28" fontStyle="italic">Pure math + Einstein physics in your pocket.</text>
            </g>
          )}
        </g>
      </svg>

      <WordSubtitles words={words} accentColor={chapterColor} bottom={44} />
    </AbsoluteFill>
  );
};
