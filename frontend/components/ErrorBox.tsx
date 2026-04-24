interface ErrorBoxProps {
  message: string;
}

export default function ErrorBox({ message }: ErrorBoxProps) {
  return (
    <div className="error-box" id="error-box" role="alert">
      <span className="error-icon">⚠️</span>
      <div className="error-text">{message}</div>
    </div>
  );
}
