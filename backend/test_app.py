"""
Unit tests for the Legal Assistant backend API.
"""

import pytest
import json
from unittest.mock import Mock, patch, MagicMock
from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def mock_openai_response():
    """Mock OpenAI API response."""
    return {
        "choices": [{
            "message": {
                "tool_calls": [{
                    "function": {
                        "arguments": json.dumps({
                            "laws": [
                                {
                                    "id": "law_1",
                                    "type": "statute",
                                    "jurisdiction_level": "state",
                                    "jurisdiction_name": "California",
                                    "citation": "Cal. Bus. & Prof. Code § 12345",
                                    "relevance_summary": "Applies to restaurant licensing",
                                    "source_name": "California Business and Professions Code"
                                }
                            ],
                            "jurisdiction_stack": [
                                {"level": "federal", "name": "United States"},
                                {"level": "state", "name": "California"},
                                {"level": "county", "name": "San Francisco County"},
                                {"level": "city", "name": "San Francisco"}
                            ]
                        })
                    }
                }]
            }
        }]
    }


class TestHealthEndpoint:
    """Tests for the health check endpoint."""
    
    def test_health_endpoint(self, client):
        """Test that health endpoint returns 200."""
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'


class TestQueryEndpoint:
    """Tests for the query endpoint."""
    
    def test_query_missing_json(self, client):
        """Test that missing JSON returns 400."""
        response = client.post('/api/query', 
                              content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_query_missing_query_field(self, client):
        """Test that missing query field returns 400."""
        response = client.post('/api/query',
                              json={'address': '123 Main St'},
                              content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_query_missing_address_field(self, client):
        """Test that missing address field returns 400."""
        response = client.post('/api/query',
                              json={'query': 'test query'},
                              content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    @patch('app.client')
    def test_query_success(self, mock_client, client):
        """Test successful query returns laws and jurisdiction stack."""
        # Create a proper mock response structure
        mock_response = MagicMock()
        mock_tool_call = MagicMock()
        mock_tool_call.function.arguments = json.dumps({
            "laws": [
                {
                    "id": "law_1",
                    "type": "statute",
                    "jurisdiction_level": "state",
                    "jurisdiction_name": "California",
                    "citation": "Cal. Bus. & Prof. Code § 12345",
                    "relevance_summary": "Applies to restaurant licensing",
                    "source_name": "California Business and Professions Code"
                }
            ],
            "jurisdiction_stack": [
                {"level": "federal", "name": "United States"},
                {"level": "state", "name": "California"}
            ]
        })
        mock_message = MagicMock()
        mock_message.tool_calls = [mock_tool_call]
        mock_choice = MagicMock()
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        mock_client.chat.completions.create.return_value = mock_response
        
        response = client.post('/api/query',
                              json={
                                  'query': 'I want to open a restaurant',
                                  'address': '123 Main St, San Francisco, CA'
                              },
                              content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'laws' in data
        assert 'jurisdiction_stack' in data
        assert isinstance(data['laws'], list)
        assert isinstance(data['jurisdiction_stack'], list)
    
    @patch('app.client')
    def test_query_openai_error(self, mock_client, client):
        """Test that OpenAI API errors are handled gracefully."""
        mock_client.chat.completions.create.side_effect = Exception("API Error")
        
        response = client.post('/api/query',
                              json={
                                  'query': 'test query',
                                  'address': '123 Main St'
                              },
                              content_type='application/json')
        
        assert response.status_code == 500
        data = json.loads(response.data)
        assert 'error' in data

