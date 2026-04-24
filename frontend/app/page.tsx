"use client";

import { useCallback, useRef, useState } from "react";

import Navbar        from "@/components/Navbar";
import Hero          from "@/components/Hero";
import UploadZone    from "@/components/UploadZone";
import FilePreview   from "@/components/FilePreview";
import ProgressBar   from "@/components/ProgressBar";
import ErrorBox      from "@/components/ErrorBox";
import SummaryPills  from "@/components/SummaryPills";
import DepressionCard from "@/components/DepressionCard";
import EmotionPanel  from "@/components/EmotionPanel";
import Footer        from "@/components/Footer";

import {
  EMOTION_COLORS,
  EMOTION_EMOJIS,
  DEPRESSION_CONFIG,
  LOADING_STEPS,
  BACKEND_URL,
} from "@/lib/constants";
import type { AnalysisResult } from "@/types/analysis";

export default function Home() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [file,        setFile]        = useState<File | null>(null);
  const [dragOver,    setDragOver]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result,      setResult]      = useState<AnalysisResult | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef   = useRef<HTMLDivElement>(null);

  // ── File helpers ───────────────────────────────────────────────────────────
  const pickFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Drag & drop ────────────────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) pickFile(f);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) pickFile(f);
  };

  // ── Analyse ────────────────────────────────────────────────────────────────
  const handleAnalyse = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError(null);

    // Cycle through descriptive loading steps
    let idx = 0;
    setLoadingStep(LOADING_STEPS[0]);
    const stepTimer = setInterval(() => {
      idx = (idx + 1) % LOADING_STEPS.length;
      setLoadingStep(LOADING_STEPS[idx]);
    }, 1800);

    try {
      const fd = new FormData();
      fd.append("video", file);

      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: fd,
      });

      clearInterval(stepTimer);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          (errData as { detail?: string }).detail ?? `Server error ${res.status}`
        );
      }

      const data: AnalysisResult = await res.json();
      setResult(data);

      // Smooth-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err) {
      clearInterval(stepTimer);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const depConfig =
    result ? (DEPRESSION_CONFIG[result.depression_level] ?? DEPRESSION_CONFIG.Minimal) : null;

  return (
    <>
      {/* Light radial background mesh */}
      <div className="bg-mesh" aria-hidden="true" />

      <Navbar />

      <main>
        {/* ── Hero ── */}
        <Hero />

        {/* ── Upload section ── */}
        <section className="upload-section container">
          <UploadZone
            file={file}
            dragOver={dragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />

          {file && (
            <FilePreview
              file={file}
              onRemove={clearFile}
              onChangeFile={() => fileInputRef.current?.click()}
            />
          )}

          {error && <ErrorBox message={error} />}

          {loading && <ProgressBar label={loadingStep} />}

          {/* Action buttons */}
          <div className="actions-row">
            <button
              id="btn-analyze"
              className="btn btn-primary"
              onClick={handleAnalyse}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <div
                    className="spinner"
                    style={{
                      borderTopColor: "#fff",
                      width: 16,
                      height: 16,
                    }}
                  />
                  Analysing…
                </>
              ) : (
                <>🔍 Analyse Audio</>
              )}
            </button>

            {file && !loading && (
              <button
                id="btn-change-file"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                📂 Change File
              </button>
            )}
          </div>
        </section>

        {/* ── Results ── */}
        {result && depConfig && (
          <section
            id="results-section"
            className="results-section container"
            ref={resultsRef}
          >
            {/* Header */}
            <div className="results-header">
              <h2 className="results-title">Analysis Results</h2>
              <span className="results-filename">📄 {result.filename}</span>
            </div>

            {/* Summary pills */}
            <SummaryPills
              result={result}
              emotionEmoji={EMOTION_EMOJIS}
              depressionConfig={depConfig}
            />

            {/* Main two-column grid */}
            <div className="results-grid" id="results-grid">
              <DepressionCard result={result} config={depConfig} />
              <EmotionPanel
                result={result}
                emotionColors={EMOTION_COLORS}
                emotionEmojis={EMOTION_EMOJIS}
              />
            </div>

            {/* Re-analyse */}
            <div className="re-analyze-row">
              <button
                id="btn-analyse-again"
                className="btn btn-secondary"
                onClick={() => {
                  clearFile();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                🔄 Analyse Another Video
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
