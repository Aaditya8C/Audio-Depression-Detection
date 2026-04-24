"use client";

import { useEffect, useState } from "react";

interface DepressionGaugeProps {
  /** Value between 0 and 1 */
  score: number;
}

export default function DepressionGauge({ score }: DepressionGaugeProps) {
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimScore(score), 150);
    return () => clearTimeout(t);
  }, [score]);

  // SVG half-circle gauge
  const strokeWidth = 11;
  const radius = 68;
  const norm = radius - strokeWidth / 2;
  const circumference = Math.PI * norm; // half-circle arc length
  const offset = circumference * (1 - animScore);

  return (
    <div className="gauge-wrap" aria-label={`Depression score gauge: ${Math.round(score * 100)}%`}>
      <svg
        width={176}
        height={100}
        viewBox="0 0 176 100"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="38%"  stopColor="#f59e0b" />
            <stop offset="75%"  stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={`M ${strokeWidth / 2},90 A ${norm},${norm} 0 0 1 ${176 - strokeWidth / 2},90`}
          fill="none"
          stroke="rgba(99,102,241,0.10)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value arc */}
        <path
          d={`M ${strokeWidth / 2},90 A ${norm},${norm} 0 0 1 ${176 - strokeWidth / 2},90`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>
    </div>
  );
}
