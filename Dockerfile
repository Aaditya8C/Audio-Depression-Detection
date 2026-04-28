# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Install system dependencies (ffmpeg for audio extraction, libsndfile for librosa)
RUN apt-get update && apt-get install -y ffmpeg libsndfile1 && rm -rf /var/lib/apt/lists/*

# Set up a non-root user (Required by Hugging Face Spaces for security)
RUN useradd -m -u 1000 user
USER user

# Set environment variables for the user
ENV PATH="/home/user/.local/bin:$PATH"
ENV HOME="/home/user"

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY --chown=user requirements.txt .

# Install Python dependencies
# We upgrade pip first to avoid common installation issues
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY --chown=user . .

# Expose the Hugging Face default port (7860)
EXPOSE 7860

# Command to run the FastAPI application on port 7860
CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "7860"]
