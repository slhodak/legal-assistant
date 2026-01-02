# Setup Guide

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file in project root (la/)
# Add your OpenAI API key:
echo "OPENAI_API_KEY=your_key_here" > ../.env
echo "PORT=5000" >> ../.env

# Run the server
python app.py
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup

Option A: Open directly in browser
- Simply open `frontend/index.html` in your web browser
- Note: You may need to serve it via HTTP server due to CORS

Option B: Serve with Python HTTP server
```bash
cd frontend
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser

### 3. Environment Variables

Create a `.env` file in the project root (`la/`) with:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=5000
```

**Important:** Never commit the `.env` file to version control. It's already in `.gitignore`.

## Testing

1. Start the backend server
2. Open the frontend in a browser
3. Try a query like:
   - Query: "I want to open a restaurant in San Francisco"
   - Address: "123 Market St, San Francisco, CA 94102"

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure:
- The backend is running
- The frontend `API_URL` in `app.js` matches your backend URL
- Flask-CORS is properly installed

### OpenAI API Errors
- Verify your API key is correct in `.env`
- Check that you have API credits available
- Ensure the model name is correct (currently using `gpt-4o`)

### Port Already in Use
If port 5000 is in use, change the `PORT` in `.env` or modify `app.py` to use a different port.

