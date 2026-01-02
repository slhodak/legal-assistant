"""
Legal Assistant Backend API
Simple Flask application that uses OpenAI to find applicable laws.
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
from prompt import SYSTEM_PROMPT
from schema import OPENAI_FUNCTION_SCHEMA

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.route("/api/query", methods=["POST"])
def query():
    """
    Handle legal query requests.

    Expected request body:
    {
        "query": "user query text",
        "address": "street address"
    }

    Returns:
    {
        "laws": [array of Law objects],
        "jurisdiction_stack": [array of jurisdiction objects]
    }
    """
    try:
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        query_text = data.get("query")
        address = data.get("address")

        if not query_text or not address:
            return jsonify({"error": "Both 'query' and 'address' are required"}), 400

        # Construct user message
        user_message = f'The user says: "{query_text}"\n\nAddress: {address}'

        # Call OpenAI API with structured output
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                tools=[{
                    "type": "function",
                    "function": OPENAI_FUNCTION_SCHEMA
                }],
                tool_choice={"type": "function",
                             "function": {"name": "return_laws"}},
                temperature=0.3
            )

            # Extract function call result
            tool_call = response.choices[0].message.tool_calls[0]
            function_args = json.loads(tool_call.function.arguments)

            return jsonify(function_args)

        except Exception as e:
            return jsonify({"error": f"OpenAI API error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
