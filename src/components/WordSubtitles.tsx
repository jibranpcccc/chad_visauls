import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type WordTiming = { word: string; start: number; end: number };

interface Props {
  words: WordTiming[];
  accentColor?: string;
  bottom?: number;
}

export const WordSubtitles: React.FC<Props> = ({ words, accentColor = "#ffb86c", bottom = 52 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const chunks = useMemo(() => {
    const out: WordTiming[][] = [];
    for (let i = 0; i < words.length; i += 6) {
      out.push(words.slice(i, i + 6));
    }
    return out;
  }, [words]);

  const activeChunk = chunks.find((c) => t >= c[0].start - 0.15 && t <= c[c.length - 1].end + 0.35);
  if (!activeChunk) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(10, 12, 18, 0.82)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(8px)",
        padding: "14px 28px",
        borderRadius: 16,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        maxWidth: "82%",
        zIndex: 50,
      }}
    >
      {activeChunk.map((w, i) => {
        const isActive = t >= w.start && t <= w.end + 0.08;
        const isPast = t > w.end + 0.08;
        return (
          <span
            key={`${w.start}-${i}`}
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: isActive ? accentColor : isPast ? "#f8fafc" : "#94a3b8",
              transform: isActive ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.08s ease",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
