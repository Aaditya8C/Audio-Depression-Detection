"""
FastAPI Backend for Depression Detection
- Accepts video upload
- Extracts audio using moviepy / ffmpeg
- Runs audio emotion inference
- Returns emotion probability vector + depression score
"""

import os
import sys
import uuid
import tempfile
import shutil
import subprocess

import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ─── Ensure project root is on the path ───────────────────────────────────────
ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)

from Audio.audio_inference import get_audio_emotion_vector_v1

# ─── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Depression Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Emotion labels (same order as audio model output) ────────────────────────
EMOTION_LABELS = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

# ─── Depression score weights (audio-only) ────────────────────────────────────
# Higher weight → emotion more associated with depression
DEPRESSION_WEIGHTS = {
    "angry":    0.60,
    "disgust":  0.55,
    "fear":     0.70,
    "happy":   -0.80,   # negative: happiness opposes depression
    "neutral":  0.10,
    "sad":      0.90,
    "surprise": -0.10,
}


# ─── Helpers ──────────────────────────────────────────────────────────────────

def extract_audio_from_video(video_path: str, audio_path: str) -> None:
    """Extract audio track from video file to a WAV using ffmpeg."""
    cmd = [
        "ffmpeg",
        "-y",                    # overwrite output
        "-i", video_path,        # input video
        "-vn",                   # no video
        "-acodec", "pcm_s16le",  # PCM 16-bit LE
        "-ar", "22050",          # sample rate matching the model
        "-ac", "1",              # mono
        audio_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {result.stderr}")


def compute_depression_score(emotion_vector: np.ndarray) -> float:
    """
    Weighted sum of emotion probabilities → normalised depression score [0, 1].
    Raw score is then clipped to [0, 1].
    """
    weights = np.array([DEPRESSION_WEIGHTS[e] for e in EMOTION_LABELS])
    raw = float(np.dot(emotion_vector, weights))

    # The theoretical range of raw is [-0.80, 0.90].
    # Normalise to [0, 1] using min-max scaling with that range.
    raw_min, raw_max = -0.80, 0.90
    score = (raw - raw_min) / (raw_max - raw_min)
    return round(float(np.clip(score, 0.0, 1.0)), 4)


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "message": "Depression Detection API is running."}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/analyze")
async def analyze_video(video: UploadFile = File(...)):
    """
    Accept a video file, extract its audio, run emotion inference,
    and return the emotion probability vector + depression score.
    """
    # ── Validate file type ──────────────────────────────────────────────────
    allowed_types = {
        "video/mp4", "video/webm", "video/ogg", "video/quicktime",
        "video/x-msvideo", "video/x-matroska", "video/avi",
    }
    ct = video.content_type or ""
    fname = video.filename or ""
    video_exts = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".ogg", ".flv"}
    ext = os.path.splitext(fname)[1].lower()

    if ct not in allowed_types and ext not in video_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: '{ct}'. Please upload a video file.",
        )

    # ── Save upload to temp dir ──────────────────────────────────────────────
    tmp_dir = tempfile.mkdtemp()
    try:
        safe_ext = ext if ext in video_exts else ".mp4"
        video_path = os.path.join(tmp_dir, f"upload{safe_ext}")
        audio_path = os.path.join(tmp_dir, "extracted_audio.wav")

        # Write video bytes
        with open(video_path, "wb") as f:
            content = await video.read()
            f.write(content)

        # ── Extract audio ────────────────────────────────────────────────────
        try:
            extract_audio_from_video(video_path, audio_path)
        except RuntimeError as e:
            raise HTTPException(
                status_code=422,
                detail=f"Audio extraction failed: {str(e)}",
            )

        if not os.path.exists(audio_path) or os.path.getsize(audio_path) == 0:
            raise HTTPException(
                status_code=422,
                detail="No audio stream found in the uploaded video.",
            )

        # ── Run inference ────────────────────────────────────────────────────
        emotion_vector = get_audio_emotion_vector_v1(audio_path)

        # ── Build response ───────────────────────────────────────────────────
        emotion_probs = {
            label: round(float(prob), 6)
            for label, prob in zip(EMOTION_LABELS, emotion_vector)
        }
        depression_score = compute_depression_score(emotion_vector)

        # Dominant emotion
        dominant_emotion = EMOTION_LABELS[int(np.argmax(emotion_vector))]

        return JSONResponse(
            content={
                "success": True,
                "filename": fname,
                "emotion_probabilities": emotion_probs,
                "emotion_vector": [round(float(v), 6) for v in emotion_vector],
                "dominant_emotion": dominant_emotion,
                "depression_score": depression_score,
                "depression_level": _depression_level(depression_score),
            }
        )

    finally:
        # Clean up temp files
        shutil.rmtree(tmp_dir, ignore_errors=True)


def _depression_level(score: float) -> str:
    if score < 0.25:
        return "Minimal"
    elif score < 0.45:
        return "Mild"
    elif score < 0.65:
        return "Moderate"
    elif score < 0.80:
        return "Moderately Severe"
    else:
        return "Severe"


# ─── Run ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
