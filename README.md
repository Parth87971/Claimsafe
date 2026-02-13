# ClaimSafe - Local Development Setup

This guide helps you run the updated ClaimSafe backend and frontend locally.

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- Git

## Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Run Backend Server

```bash
python app.py
```

The backend will start at **`http://localhost:5000`**

**Health check:** Visit `http://localhost:5000/health`

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

The `.env.local` file is already configured for local development:

```
VITE_API_URL=http://localhost:5000/api
VITE_RENDER_API_KEY=local-dev-key
```

**Note:** For local development, the API key is not required - it's only used when connecting to remote services.

### 3. Run Frontend Dev Server

```bash
npm run dev
```

The frontend will start at **`http://localhost:5173`** (or another available port)

## Running Both Servers Simultaneously

### Option 1: Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Single Terminal with & (Windows PowerShell)

```bash
# From project root
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "backend/app.py"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "frontend"
```

## How It Works

1. **Frontend** runs on `http://localhost:5173`
2. **Backend API** runs on `http://localhost:5000/api`
3. **Frontend makes requests** to backend using the local URL
4. **CORS is enabled** on the backend - all local requests are allowed

## Testing the Setup

### Upload a Policy PDF

1. Open `http://localhost:5173` in your browser
2. Click "Upload Your Policy Document"
3. Select any PDF file (the demo will parse it for room rent limits, exclusions, etc.)
4. Click "Analyze Claim"
5. Fill in claim details and submit

### What Changed

- **Room rent handling:** If a policy document has no room rent sublimit, the analysis will completely skip room rent checks - no default values are applied
- **API responses** now include `room_rent_sublimit_found` flag to indicate whether room rent was actually found in the policy

## Troubleshooting

### "Cannot connect to backend" error
- Ensure backend is running: `python app.py`
- Check backend is listening on `http://localhost:5000`
- Verify CORS is enabled (should show in backend logs)

### "Module not found" errors (Python)
```bash
cd backend
pip install -r requirements.txt
```

### "npm dependencies" errors
```bash
cd frontend
npm install
```

### Port already in use
- Backend (default 5000): Change in `app.py` → `app.run(port=5001, ...)`
- Frontend (default 5173): Vite will suggest next available port

## API Endpoints

The backend provides these endpoints:

- `GET /health` - Service health check
- `POST /api/policy/upload-pdf` - Upload and parse policy PDF
- `POST /api/claim/analyze` - Analyze claim risk

## Environment Variables

The frontend uses:

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:5000/api`)
- `VITE_RENDER_API_KEY` - API key for authentication (optional for local development)

Both are configured in `.env.local` for local development.

---
