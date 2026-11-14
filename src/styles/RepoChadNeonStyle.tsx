import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Style 3: RepoChad Dark Obsidian + Neon Cards + Kinetic Motion */
export const RepoChadNeonStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const notchSlide = spring({ frame, fps, config: { damping: 16, stiffness: 200 } });
  const card1 = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 14, stiffness: 180 } });
  const card2 = spring({ frame: Math.max(0, frame - 42), fps, config: { damping: 14, stiffness: 180 } });
  const card3 = spring({ frame: Math.max(0, frame - 66), fps, config: { damping: 14, stiffness: 180 } });
  const barWidth = interpolate(frame, [48, 115], [0, 94], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0D13", color: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif", padding: "64px 80px" }}>
      {/* Subtle Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Chapter Notch */}
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          background: "rgba(34, 211, 238, 0.12)",
          border: "2px solid #22D3EE",
          borderRadius: 999,
          padding: "10px 26px",
          fontFamily: "monospace",
          fontSize: 22,
          fontWeight: 700,
          color: "#22D3EE",
          width: "fit-content",
          transform: `translateY(${(1 - notchSlide) * -30}px)`,
        }}
      >
        <span>●</span> STYLE 3 // REPOCHAD KINETIC
      </div>

      {/* Main Kinetic Headline */}
      <div style={{ position: "relative", marginTop: 40 }}>
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.08 }}>
          RENDER VIDEO <span style={{ color: "#4ADE80" }}>100% IN CODE</span>
        </div>
        <div style={{ fontSize: 32, color: "#94A3B8", marginTop: 14, fontWeight: 500 }}>
          Zero AI video hallucinations · Exact 60fps word-locked sync
        </div>
      </div>

      {/* 3 Glowing Neon Cards */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 36, marginTop: 72 }}>
        <div
          style={{
            background: "#121622",
            border: "2px solid #22D3EE",
            boxShadow: "0 0 36px rgba(34,211,238,0.22)",
            borderRadius: 24,
            padding: 36,
            transform: `scale(${card1})`,
          }}
        >
          <div style={{ fontFamily: "monospace", color: "#22D3EE", fontSize: 20, fontWeight: 700 }}>01 / SCRIPT</div>
          <div style={{ fontSize: 38, fontWeight: 800, marginTop: 16 }}>Beat Formula</div>
          <div style={{ fontSize: 24, color: "#94A3B8", marginTop: 12, lineHeight: 1.4 }}>
            Hook, escalation, twist & verified facts timed to words.
          </div>
        </div>

        <div
          style={{
            background: "#121622",
            border: "2px solid #A855F7",
            boxShadow: "0 0 36px rgba(168,85,247,0.22)",
            borderRadius: 24,
            padding: 36,
            transform: `scale(${card2})`,
          }}
        >
          <div style={{ fontFamily: "monospace", color: "#A855F7", fontSize: 20, fontWeight: 700 }}>02 / ENGINE</div>
          <div style={{ fontSize: 38, fontWeight: 800, marginTop: 16 }}>Remotion + SVG</div>
          <div style={{ fontSize: 24, color: "#94A3B8", marginTop: 12, lineHeight: 1.4 }}>
            Deterministic React frames + Three.js + FFmpeg mastering.
          </div>
        </div>

        <div
          style={{
            background: "#121622",
            border: "2px solid #FB923C",
            boxShadow: "0 0 36px rgba(251,146,60,0.22)",
            borderRadius: 24,
            padding: 36,
            transform: `scale(${card3})`,
          }}
        >
          <div style={{ fontFamily: "monospace", color: "#FB923C", fontSize: 20, fontWeight: 700 }}>03 / CLOUD CI</div>
          <div style={{ fontSize: 38, fontWeight: 800, marginTop: 16 }}>GitHub Actions</div>
          <div style={{ fontSize: 24, color: "#94A3B8", marginTop: 12, lineHeight: 1.4 }}>
            Push code → auto-render MP4 artifacts in the cloud.
          </div>
        </div>
      </div>

      {/* Live Progress Bar */}
      <div style={{ position: "relative", marginTop: 72, background: "#121622", border: "1px solid #1E293B", borderRadius: 20, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 22, marginBottom: 16 }}>
          <span style={{ color: "#4ADE80" }}>PIPELINE SYNC SCORE</span>
          <span>{Math.round(barWidth)}%</span>
        </div>
        <div style={{ height: 22, background: "#1E293B", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ width: `${barWidth}%`, height: "100%", background: "linear-gradient(90deg, #22D3EE, #4ADE80)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
