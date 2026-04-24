"use client";

import { useCallback, useRef } from "react";

interface UploadZoneProps {
  file: File | null;
  dragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function UploadZone({
  file,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  fileInputRef,
}: UploadZoneProps) {
  const handleClick = useCallback(() => {
    if (!file) fileInputRef.current?.click();
  }, [file, fileInputRef]);

  const zoneClass = [
    "upload-zone",
    dragOver ? "drag-over" : "",
    file ? "has-file" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id="upload-zone"
      className={zoneClass}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleClick}
      role="button"
      aria-label="Upload video file"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={onFileChange}
        id="video-file-input"
        aria-label="Video file input"
      />

      {!file ? (
        <>
          <span className="upload-icon">🎬</span>
          <div className="upload-title">Drop your video here</div>
          <div className="upload-hint">
            or <span>click to browse</span> · MP4, MOV, AVI, MKV, WebM
          </div>
        </>
      ) : (
        <>
          <span className="upload-icon">✅</span>
          <div className="upload-title">Video ready for analysis</div>
          <div className="upload-hint">Click Analyse to proceed</div>
        </>
      )}
    </div>
  );
}
