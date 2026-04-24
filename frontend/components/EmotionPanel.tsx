import EmotionBar from "./EmotionBar";
import type { AnalysisResult } from "@/types/analysis";

interface EmotionPanelProps {
  result: AnalysisResult;
  emotionColors: Record<string, string>;
  emotionEmojis: Record<string, string>;
}

export default function EmotionPanel({
  result,
  emotionColors,
  emotionEmojis,
}: EmotionPanelProps) {
  // Sort emotions by probability (highest first)
  const sortedEmotions = Object.entries(result.emotion_probabilities).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="card" id="emotion-probabilities-card">
      <div className="card-label">Emotion Probability Vector</div>

      <div className="emotion-grid">
        {sortedEmotions.map(([emotion, prob]) => (
          <EmotionBar
            key={emotion}
            emotion={emotion}
            prob={prob}
            isDominant={emotion === result.dominant_emotion}
            color={emotionColors[emotion] ?? "#6366f1"}
            emoji={emotionEmojis[emotion] ?? "❓"}
          />
        ))}
      </div>

      {/* Raw vector disclosure */}
      <details className="raw-vector-details" id="raw-vector-details">
        <summary className="raw-vector-summary">
          📋 Show raw probability vector
        </summary>
        <pre className="raw-vector-pre" id="raw-vector-pre">
          {JSON.stringify(result.emotion_probabilities, null, 2)}
        </pre>
      </details>
    </div>
  );
}
