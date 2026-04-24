export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-eyebrow">
        <span>🎙️</span>
        <span>Deep Learning · Emotion Recognition</span>
      </div>
      <h1 className="hero-title">
        Detect Depression
        <br />
        <span className="gradient-text">Through Your Voice</span>
      </h1>
      <p className="hero-subtitle">
        Upload a video recording. Our AI extracts the speech audio, maps seven
        core emotions, and generates a clinical-grade depression risk score —
        all in seconds.
      </p>
    </section>
  );
}
