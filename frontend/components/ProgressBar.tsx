interface ProgressBarProps {
  label: string;
}

export default function ProgressBar({ label }: ProgressBarProps) {
  return (
    <div className="progress-container" id="progress-container">
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" aria-hidden="true" />
      </div>
      <div className="progress-label">
        <div className="spinner" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}
