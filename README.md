# Audio Depression Detection System

This project is a full-stack application for detecting depression from video inputs. It extracts audio from the uploaded video and runs an emotion inference model to calculate a depression score.

## Project Structure

- `backend.py`: FastAPI application serving the inference model.
- `frontend/`: Next.js frontend application for the user interface.
- `Audio/`: Audio emotion inference scripts.
- `models/`: Directory containing the pre-trained `.h5` keras models.
- `requirements.txt`: Python backend dependencies.

## Prerequisites

Before running the application, ensure you have the following installed on your system:

1. **Python 3.8+**
2. **Node.js (v18+ recommended) and npm**
3. **FFmpeg**: The backend relies on the system `ffmpeg` binary to extract audio from video files.
   - **Windows**: You can install it via winget: `winget install Gyan.FFmpeg`
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg`
   - Ensure `ffmpeg` is added to your system's PATH.

## Step-by-step Setup and Execution

### 1. Backend Setup

The backend uses FastAPI and runs on Python. 

1. Open a terminal and navigate to the project root directory:
   ```bash
   cd Audio-Model
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate it (Windows)
   venv\Scripts\activate
   
   # Activate it (macOS/Linux)
   source venv/bin/activate
   ```

3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI backend server:
   ```bash
   python backend.py
   ```
   *The backend will now be running at `http://localhost:8000`.*

### 2. Frontend Setup

The frontend is built with Next.js. You need to run it in a separate terminal.

1. Open a **new** terminal window/tab.

2. Navigate to the `frontend` directory:
   ```bash
   cd Audio-Model/frontend
   ```

3. Install the Node.js dependencies:
   ```bash
   npm install
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:3000`.*

## Usage

1. Once both servers are running, open your browser and navigate to `http://localhost:3000`.
2. Upload a video file through the UI.
3. The system will extract the audio from the video, run it through the emotion inference model, and display the emotion probabilities along with an overall depression risk score.
