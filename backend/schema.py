"""
Simplified MVP schema for Law objects.
This schema is simpler than schema-short.json, containing only essential fields.
"""

# JSON Schema for Law objects (simplified MVP)
LAW_SCHEMA = {
    "type": "object",
    "properties": {
        "laws": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "id",
                    "type",
                    "jurisdiction_level",
                    "jurisdiction_name",
                    "citation",
                    "relevance_summary",
                    "source_name"
                ],
                "properties": {
                    "id": {
                        "type": "string",
                        "minLength": 1
                    },
                    "type": {
                        "type": "string",
                        "enum": [
                            "statute",
                            "regulation",
                            "case",
                            "ordinance",
                            "constitution",
                            "other"
                        ]
                    },
                    "jurisdiction_level": {
                        "type": "string",
                        "enum": [
                            "federal",
                            "state",
                            "county",
                            "city",
                            "special_district"
                        ]
                    },
                    "jurisdiction_name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "citation": {
                        "type": "string",
                        "minLength": 1
                    },
                    "relevance_summary": {
                        "type": "string",
                        "minLength": 1
                    },
                    "source_name": {
                        "type": "string",
                        "minLength": 1
                    },
                    "source_url": {
                        "type": "string",
                        "format": "uri"
                    },
                    "title": {
                        "type": "string"
                    },
                    "tags": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "additionalProperties": False
            }
        },
        "jurisdiction_stack": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["level", "name"],
                "properties": {
                    "level": {
                        "type": "string",
                        "enum": ["federal", "state", "county", "city", "special_district"]
                    },
                    "name": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "required": ["laws", "jurisdiction_stack"],
    "additionalProperties": False
}

# OpenAI function calling schema format
OPENAI_FUNCTION_SCHEMA = {
    "name": "return_laws",
    "description": "Return the applicable laws and jurisdiction stack for the user's query",
    "parameters": {
        "type": "object",
        "properties": {
            "laws": {
                "type": "array",
                "description": "Array of applicable laws",
                "items": {
                    "type": "object",
                    "required": [
                        "id",
                        "type",
                        "jurisdiction_level",
                        "jurisdiction_name",
                        "citation",
                        "relevance_summary",
                        "source_name"
                    ],
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique identifier for this law"
                        },
                        "type": {
                            "type": "string",
                            "enum": ["statute", "regulation", "case", "ordinance", "constitution", "other"],
                            "description": "Type of law"
                        },
                        "jurisdiction_level": {
                            "type": "string",
                            "enum": ["federal", "state", "county", "city", "special_district"],
                            "description": "Level of jurisdiction"
                        },
                        "jurisdiction_name": {
                            "type": "string",
                            "description": "Name of the jurisdiction (e.g., 'California', 'San Francisco')"
                        },
                        "citation": {
                            "type": "string",
                            "description": "Citation string (e.g., 'Cal. Bus. & Prof. Code § 12345')"
                        },
                        "relevance_summary": {
                            "type": "string",
                            "description": "Why this law is relevant to the user's query"
                        },
                        "source_name": {
                            "type": "string",
                            "description": "Name of the source where this information came from"
                        },
                        "source_url": {
                            "type": "string",
                            "description": "Optional URL to the source"
                        },
                        "title": {
                            "type": "string",
                            "description": "Optional display title"
                        },
                        "tags": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Optional tags for filtering"
                        }
                    },
                    "additionalProperties": False
                }
            },
            "jurisdiction_stack": {
                "type": "array",
                "description": "Full jurisdictional stack for the address",
                "items": {
                    "type": "object",
                    "required": ["level", "name"],
                    "properties": {
                        "level": {
                            "type": "string",
                            "enum": ["federal", "state", "county", "city", "special_district"]
                        },
                        "name": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "required": ["laws", "jurisdiction_stack"],
        "additionalProperties": False
    }
}

