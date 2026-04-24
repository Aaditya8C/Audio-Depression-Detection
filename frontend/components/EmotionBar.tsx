"use client";

import { useEffect, useState } from "react";

interface EmotionBarProps {
  emotion: string;
  prob: number;
  isDominant: boolean;
  color: string;
  emoji: string;
}

export default function EmotionBar({
  emotion,
  prob,
  isDominant,
  color,
  emoji,
}: EmotionBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Trigger animation on mount
    const t = setTimeout(() => setWidth(prob * 100), 80);
    return () => clearTimeout(t);
  }, [prob]);

  return (
    <div className="emotion-row" id={`emotion-row-${emotion}`}>
      <div className="emotion-label">
        <span>{emoji}</span>
        <span>{emotion}</span>
      </div>

      <div className="emotion-bar-track">
        <div
          className="emotion-bar-fill"
          style={{
            width: `${width}%`,
            background: isDominant
              ? `linear-gradient(90deg, ${color}bb, ${color})`
              : `linear-gradient(90deg, ${color}66, ${color}99)`,
            boxShadow: isDominant ? `0 0 10px ${color}44` : "none",
          }}
        />
      </div>

      <div
        className="emotion-pct"
        style={{ color: isDominant ? color : undefined }}
      >
        {(prob * 100).toFixed(1)}%
      </div>
    </div>
  );
}
