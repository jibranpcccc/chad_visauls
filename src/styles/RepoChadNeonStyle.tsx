import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordSubtitles, WordTiming } from "../components/WordSubtitles";
import wordsData from "../data/words_style3.json";

const words = wordsData as WordTiming[];

const ObsidianGrid: React.FC<{ chapter: string; color?: string }> = ({ chapter, color = "#22D3EE" }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#0B0D13",
        backgroundImage: "linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 52,
        left: 76,
        background: "rgba(18, 22, 34, 0.9)",
        border: `2px solid ${color}`,
        borderRadius: 999,
        padding: "10px 26px",
        fontFamily: "monospace",
        fontSize: 22,
        fontWeight: 800,
        color,
      }}
    >
      ● {chapter}
    </div>
  </>
);

const Scene1Scale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const count = interpolate(frame, [20, 260], [0.1, 4.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <ObsidianGrid chapter="01 // 4 TRILLION MESSAGES" color="#22D3EE" />
      <div style={{ position: "relative", padding: "150px 80px", transform: `scale(${pop})` }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: "#f8fafc" }}>
          DISCORD&apos;S <span style={{ color: "#22D3EE" }}>4,000,000,000,000+</span> MESSAGES
        </div>
        <div style={{ marginTop: 50, background: "#121622", border: "2px solid #22D3EE", borderRadius: 24, padding: 48, boxShadow: "0 0 40px rgba(34,211,238,0.2)" }}>
          <div style={{ fontFamily: "monospace", fontSize: 24, color: "#94A3B8" }}>LIVE MESSAGE STORAGE</div>
          <div style={{ fontSize: 108, fontWeight: 900, color: "#4ADE80", marginTop: 12 }}>{count.toFixed(2)} TRILLION</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene2MongoAndCassandra: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isCass = frame >= 260;
  const spike = interpolate(frame % 260, [20, 200], [18, 96], { extrapolateRight: "clamp" });
  const cardPop = spring({ frame: Math.max(0, frame - (isCass ? 260 : 0)), fps, config: { damping: 14, stiffness: 180 } });

  return (
    <AbsoluteFill>
      <ObsidianGrid chapter={isCass ? "03 // CASSANDRA JVM GC TRAP" : "02 // MONGODB HOT PARTITIONS"} color={isCass ? "#A855F7" : "#FB923C"} />
      <div style={{ position: "relative", padding: "150px 80px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40 }}>
        <div style={{ background: "#121622", border: `2px solid ${isCass ? "#A855F7" : "#FB923C"}`, borderRadius: 24, padding: 42, transform: `scale(${cardPop})` }}>
          <div style={{ fontFamily: "monospace", fontSize: 22, color: isCass ? "#A855F7" : "#FB923C" }}>
            {isCass ? "JVM GARBAGE COLLECTION" : "DATABASE BOTTLENECK"}
          </div>
          <div style={{ fontSize: 54, fontWeight: 900, color: "#fff", marginTop: 14 }}>
            {isCass ? "10+ Second Stop-The-World Pauses" : "Hot Servers Hit a Wall"}
          </div>
          <div style={{ fontSize: 28, color: "#94A3B8", marginTop: 18, lineHeight: 1.45 }}>
            {isCass
              ? "Deleted message tombstones piled up, freezing entire Discord channels."
              : "100M → Billions of messages caused read latencies to spike out of control."}
          </div>
        </div>
        <div style={{ background: "#121622", border: "2px solid #EF4444", borderRadius: 24, padding: 42, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ fontFamily: "monospace", fontSize: 22, color: "#EF4444", marginBottom: 16 }}>TAIL LATENCY SPIKE</div>
          <div style={{ height: 280, background: "#1E293B", borderRadius: 16, display: "flex", alignItems: "flex-end", padding: 14 }}>
            <div style={{ width: "100%", height: `${spike}%`, background: "linear-gradient(180deg, #EF4444, #FB923C)", borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene3ScyllaResult: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const latency = Math.round(interpolate(frame, [40, 260], [120, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const nodes = Math.round(interpolate(frame, [40, 260], [177, 72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });

  return (
    <AbsoluteFill>
      <ObsidianGrid chapter="04 // SCYLLADB C++ ENGINE" color="#4ADE80" />
      <div style={{ position: "relative", padding: "150px 80px", transform: `scale(${pop})` }}>
        <div style={{ fontSize: 66, fontWeight: 900, color: "#fff" }}>
          REWRITTEN IN <span style={{ color: "#4ADE80" }}>C++ (ZERO GC)</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginTop: 52 }}>
          <div style={{ background: "#121622", border: "2px solid #4ADE80", borderRadius: 22, padding: 36 }}>
            <div style={{ fontFamily: "monospace", color: "#4ADE80", fontSize: 20 }}>CLUSTER NODES</div>
            <div style={{ fontSize: 84, fontWeight: 900, color: "#fff", marginTop: 10 }}>{nodes}</div>
            <div style={{ fontSize: 22, color: "#94A3B8" }}>Down from 177 nodes</div>
          </div>
          <div style={{ background: "#121622", border: "2px solid #22D3EE", borderRadius: 22, padding: 36 }}>
            <div style={{ fontFamily: "monospace", color: "#22D3EE", fontSize: 20 }}>TAIL LATENCY</div>
            <div style={{ fontSize: 84, fontWeight: 900, color: "#fff", marginTop: 10 }}>{latency}ms</div>
            <div style={{ fontSize: 22, color: "#94A3B8" }}>Down from 120ms</div>
          </div>
          <div style={{ background: "#121622", border: "2px solid #A855F7", borderRadius: 22, padding: 36 }}>
            <div style={{ fontFamily: "monospace", color: "#A855F7", fontSize: 20 }}>GC PAUSES</div>
            <div style={{ fontSize: 84, fontWeight: 900, color: "#4ADE80", marginTop: 10 }}>0 ms</div>
            <div style={{ fontSize: 22, color: "#94A3B8" }}>Shard-per-core C++</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RepoChadNeonStyle: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
    <Audio src={staticFile("audio/style3_master.wav")} />
    <Sequence from={0} durationInFrames={360}><Scene1Scale /></Sequence>
    <Sequence from={360} durationInFrames={810}><Scene2MongoAndCassandra /></Sequence>
    <Sequence from={1170} durationInFrames={707}><Scene3ScyllaResult /></Sequence>
    <WordSubtitles words={words} accentColor="#4ADE80" />
  </AbsoluteFill>
);
