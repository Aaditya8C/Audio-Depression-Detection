import type { AnalysisResult, DepressionConfig } from "@/types/analysis";

interface SummaryPillsProps {
  result: AnalysisResult;
  emotionEmoji: Record<string, string>;
  depressionConfig: DepressionConfig;
}

export default function SummaryPills({
  result,
  emotionEmoji,
  depressionConfig,
}: SummaryPillsProps) {
  const pct = Math.round(result.depression_score * 100);

  return (
    <div className="summary-row" id="summary-pills">
      <div className="summary-pill" id="pill-dominant">
        <span className="pill-icon">
          {emotionEmoji[result.dominant_emotion] ?? "😐"}
        </span>
        <div className="pill-info">
          <span className="pill-value">{result.dominant_emotion}</span>
          <span className="pill-key">Dominant Emotion</span>
        </div>
      </div>

      <div className="summary-pill" id="pill-score">
        <span className="pill-icon">📊</span>
        <div className="pill-info">
          <span
            className="pill-value"
            style={{ color: depressionConfig.color }}
          >
            {pct}%
          </span>
          <span className="pill-key">Depression Score</span>
        </div>
      </div>

      <div className="summary-pill" id="pill-level">
        <span className="pill-icon">{depressionConfig.emoji}</span>
        <div className="pill-info">
          <span className="pill-value">{result.depression_level}</span>
          <span className="pill-key">Risk Level</span>
        </div>
      </div>
    </div>
  );
}
