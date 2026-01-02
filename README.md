# Legal Assistant

A jurisdiction-aware legal research assistant that finds applicable laws for user queries with addresses.

## Features

- Accepts natural language queries with street addresses
- Returns applicable laws organized by jurisdiction level
- Displays citations, relevance summaries, and source information
- Simple, minimal architecture with Python backend and vanilla HTML/JS frontend

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

### Backend

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

4. Run the backend server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend

1. Open `frontend/index.html` in a web browser, or serve it using a simple HTTP server:
```bash
cd frontend
python -m http.server 8000
```

2. Open `http://localhost:8000` in your browser

Note: If serving the frontend separately, update the `API_URL` in `frontend/app.js` to match your backend URL.

## Usage

1. Enter your query in natural language (e.g., "I want to open a restaurant in San Francisco")
2. Enter the street address (e.g., "123 Main St, San Francisco, CA 94102")
3. Click "Find Applicable Laws"
4. Review the results organized by jurisdiction level

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

## License

MIT