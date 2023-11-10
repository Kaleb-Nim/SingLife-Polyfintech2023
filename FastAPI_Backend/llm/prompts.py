
VIDEO_SCRIPT_JSON_OUTPUT = """
        json_schema2 = {
            "name": "format_video_script",
            "description": "Formats to a 15-30sec video script.",
            "type": "object",
            "properties": {
            "list_of_scenes": {
                "type": "array",
                "items": {
                "type": "object",
                "properties": {
                    "scene": {
                    "type": "string",
                    "description": "Scene description for video should be visual and general. Max 5 words"
                    },
                    "subtitles": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "video subtitles script for video"
                    }
                    }
                },
                "required": ["scene", "subtitles"]
                }
            }
            },
            "required": ["list_of_scenes"]
        }
"""

VIDEO_SCRIPT_PROMPT = """Goal:Generate 30-45sec video script based on custom knowledge base (Information below) and user query. Two components 1.Scene assets descriptions (Max 5 words) 2.Subtitle script 
    Custom knowledge base:{relevant_documents}\n\nReturn the generated video script in the style/format: Funny and sarcastic\nFormat the video script to JSON object with list_of_scences, scenes and subtitles\nUsing the above information, generate a video script that addresses this user query:\n\n"{query}"."""

PINECONE_QUERY_FORMATTER = """Role: Help insurance customers figure out what's the best product to purchase given their needs. Product information are stored in PDFs of documents and the goal is to extract most\n
  Given the following user prompt, formulate a paragraph depicting what would be the most relevant to provide the user with an answer from a knowledge base.
    You should follow the following rules when generating and answer:
    - You should remove any punctuation from the question
    - You should remove any words that are not relevant to the question
    - If you are unable to formulate a question, respond with the same USER PROMPT you got.

    USER PROMPT: {userPrompt}

    CONVERSATION LOG: {conversationHistory}

    Final answer:
    `
"""

RELEVANT_DOCUMENT_FILTER_PROMPT="""Goal: Filter out documents based on the following rules:\n
1. Documents must contain information that can help answering the user query
Ask yourself, "Does this document contain information that would help answer the query? Give a short explanation of why or why not."

Document:
{document}

Give a short explanation as to why yo and return True or False.
"""
