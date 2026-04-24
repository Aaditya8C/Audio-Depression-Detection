function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  onChangeFile: () => void;
}

export default function FilePreview({ file, onRemove, onChangeFile }: FilePreviewProps) {
  return (
    <div className="file-preview" id="file-preview">
      <span className="file-icon">🎥</span>
      <div className="file-info">
        <div className="file-name" title={file.name}>
          {file.name}
        </div>
        <div className="file-size">{formatBytes(file.size)}</div>
      </div>
      <button
        className="btn-remove"
        id="btn-remove-file"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        ✕ Remove
      </button>
    </div>
  );
}
