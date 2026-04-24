export interface AnalysisResult {
  success: boolean;
  filename: string;
  emotion_probabilities: Record<string, number>;
  emotion_vector: number[];
  dominant_emotion: string;
  depression_score: number;
  depression_level: string;
}

export interface DepressionConfig {
  color: string;
  bg: string;
  emoji: string;
  desc: string;
}
