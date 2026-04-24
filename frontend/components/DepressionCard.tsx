import DepressionGauge from "./DepressionGauge";
import type { AnalysisResult, DepressionConfig } from "@/types/analysis";

interface DepressionCardProps {
  result: AnalysisResult;
  config: DepressionConfig;
}

export default function DepressionCard({ result, config }: DepressionCardProps) {
  const pct = Math.round(result.depression_score * 100);

  return (
    <div
      className="dep-score-card"
      id="depression-score-card"
      style={{ borderColor: `${config.color}28` }}
    >
      {/* Top accent bar */}
      <div
        className="dep-top-bar"
        style={{
          background: `linear-gradient(90deg, ${config.color}88, ${config.color})`,
        }}
      />

      <div className="card-label" style={{ justifyContent: "center" }}>
        Depression Risk Score
      </div>

      {/* Gauge */}
      <DepressionGauge score={result.depression_score} />

      {/* Big number */}
      <div className="dep-score-number" style={{ color: config.color }}>
        {pct}
        <sup>%</sup>
      </div>

      {/* Level badge */}
      <div
        className="dep-level-badge"
        style={{
          background: config.bg,
          color: config.color,
          border: `1.5px solid ${config.color}38`,
        }}
      >
        <span>{config.emoji}</span>
        <span>{result.depression_level}</span>
      </div>

      <p className="dep-description">{config.desc}</p>

      <p className="dep-disclaimer">
        ⚠️ This is a research tool. Not a clinical diagnosis.
      </p>
    </div>
  );
}
