
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

VIDEO_SCRIPT_PROMPT = """Goal:Generate 30-45sec video script to generate a video to engage with a customer needs.\n\n
RULES:
1. Video script must be based on the "Custom knowledge base:" and "User query"
2. Video Script must comprise of a) Video Script voice over text, b) Visual background video descriptions
    2a) Scene description for video should be visual and general. Max 5 words\nExample:family trip skiing | accident bike crash
3. Length of video script must be 30-45sec, 6 scenes or more, cannot be too short
4. Format the video script to JSON object with list_of_scences, scenes and subtitles
5. Curate the POV to be watched from the perspective of the customer (1st person)
6. Style of video script should be funny and sarcastic
7. Video script as much as possible to include specific financial product names from custom knowledge base, if any\n\n

Custom knowledge base:\n-------------------------{relevant_documents}\n---------------------------------\n\n

Stricly following the RULES: generate a video script to answer the User Query:"{query}"."""

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

RELEVANT_DOCUMENT_FILTER_PROMPT="""Goal: Identify relevant text information based on the following rules:\n
1. Text must have some relevancy information that can help answering the user query
2. Your final answer does not have to answer the use query. You just have to answer identify relevant text information that can help answering the user query, if any.
3. Relevant output information to answer user context should be very exhaustive, as much as possible, ~1500 words
4. You do not have to explan any reasoning for your answer, just provide the relevant text information that can help answering the user query immediately
Ask yourself, "Does this document contain information that would help answer the query? "

Documents:
{documents}

Return All relevant information as much as possible that could potentially help answer: {userPrompt} 
"""
