# Legal Assistant

A jurisdiction-aware legal research assistant that finds applicable laws for user queries with addresses.

## Project Structure

```
la/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── prompt.py              # System prompt (Python module)
│   ├── schema.py              # Law object schema (Python module)
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── index.html             # Main UI
│   ├── style.css              # Styling
│   └── app.js                 # Frontend logic
└── README.md
```
  
## Setup

### Prerequisites

**Important:** Pyenv must be initialized in your shell. If `pyenv` command is not found, see `PYENV_SETUP.md` for setup instructions.

### Backend

1. Set Python version and create a virtual environment:
```bash
cd backend
pyenv local 3.13.2
python -m venv venv
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root:
```
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=9000
```

**Important:** Never commit the `.env` file to version control. It's already in `.gitignore`.

4. Run the backend server:
```bash
python3 app.py
```

The API will be available at `http://localhost:9000`

### Frontend

1. Open `frontend/index.html` in a web browser, or serve it using a simple HTTP server:
```bash
cd frontend
python3 -m http.server 8000
```

2. Open `http://localhost:8000` in your browser

Note: If serving the frontend separately, update the `API_URL` in `frontend/app.js` to match your backend URL.

### Troubleshooting

#### CORS Errors
If you see CORS errors, make sure:
- The backend is running
- The frontend `API_URL` in `app.js` matches your backend URL
- Flask-CORS is properly installed

#### OpenAI API Errors
- Verify your API key is correct in `.env`
- Check that you have API credits available
- Ensure the model name is correct (currently using `gpt-4o`)

#### Port Already in Use
If port 9000 is in use, change the `PORT` in `.env` or modify `app.py` to use a different port.

## Usage

1. Enter your query in natural language (e.g., "I want to open a restaurant in San Francisco")
2. Enter the street address (e.g., "123 Main St, San Francisco, CA 94102")
3. Click "Find Applicable Laws"
4. Review the results organized by jurisdiction level

## Screenshots

Example query results displayed in the UI:

<img src="images/Screenshot 2026-01-04 at 7.28.10 PM.png" alt="Query results example 1" width="800">

<img src="images/Screenshot 2026-01-04 at 7.28.20 PM.png" alt="Query results example 2" width="800">

<img src="images/Screenshot 2026-01-04 at 7.28.25 PM.png" alt="Query results example 3" width="800">

## API

### POST /api/query

Request body:
```json
{
  "query": "user query text",
  "address": "street address"
}
```

Response:
```json
{
  "laws": [
    {
      "id": "law_1",
      "type": "statute",
      "jurisdiction_level": "state",
      "jurisdiction_name": "California",
      "citation": "Cal. Bus. & Prof. Code § 12345",
      "relevance_summary": "This statute regulates...",
      "source_name": "California Legislative Information",
      "source_url": "https://...",
      "title": "Optional title",
      "tags": ["tag1", "tag2"]
    }
  ],
  "jurisdiction_stack": [
    {"level": "federal", "name": "United States"},
    {"level": "state", "name": "California"},
    {"level": "county", "name": "San Francisco County"},
    {"level": "city", "name": "San Francisco"}
  ]
}
```

## Dependencies

- Flask: Web framework
- OpenAI: LLM API client
- flask-cors: CORS support
- python-dotenv: Environment variable management
- httpx: HTTP client (pinned to 0.27.0 for compatibility with OpenAI 1.12.0)

## License

MIT
