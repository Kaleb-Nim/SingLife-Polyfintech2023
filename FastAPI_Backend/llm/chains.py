import openai
# from openai import AsyncOpenAI
from openai import AsyncAzureOpenAI
import asyncio

from dotenv import load_dotenv
import os
from .prompts import VIDEO_SCRIPT_PROMPT,VIDEO_SCRIPT_JSON_OUTPUT,RELEVANT_DOCUMENT_FILTER_PROMPT
print(load_dotenv('../.env'))

client = AsyncAzureOpenAI(
    azure_endpoint=os.getenv("OPENAI_API_ENDPOINT"), 
    api_key=os.getenv("OPENAI_API_KEY"),  
    api_version=os.getenv("OPENAI_API_VERSION"),
)

def inquireChain(query:str) -> str:
    """So bascially askes"""

async def relevantDocumentFilter(relevant_documents:list[dict],query:str)->str:
    """Filters only the relevant documents by LLM"""

    # Concatenate all the documents into one string
    relevant_documents = [document["metadata"]["text"] for document in relevant_documents]
    # Async call to LLM for each document 

    prompt = RELEVANT_DOCUMENT_FILTER_PROMPT.format(documents = relevant_documents,userPrompt=query)
    completion = await client.chat.completions.create(
        model=os.getenv("OPENAI_API_ENGINE"),
        messages=[{"role":"system","content":f"Role:You are an assistant to complie all documents information are relevant to the user question: {query}"},
                  {"role": "user", "content": prompt}
                ],
        max_tokens = 1500
    )
    print(f'Tokens used for relevantDocumentFilter: {completion.usage}')
    return completion.choices[0].message.content

import asyncio

client = AsyncAzureOpenAI(
    azure_endpoint=os.getenv("OPENAI_API_ENDPOINT"), 
    api_key=os.getenv("OPENAI_API_KEY"),  
    api_version=os.getenv("OPENAI_API_VERSION"),
)


async def generate_video(relevant_documents:str,query:str)->dict:
    """Generates a video script from the relevant documents and query
    Output should be a dict with the following keys:
        list_of_scenes: list[dict]
            scene: str
            subtitles: list[str]
    """

    prompt = VIDEO_SCRIPT_PROMPT.format(query=query,relevant_documents=relevant_documents,VIDEO_SCRIPT_JSON_OUTPUT=VIDEO_SCRIPT_JSON_OUTPUT)
    completion = await client.chat.completions.create(
        model=os.getenv("OPENAI_API_ENGINE"),
        temperature=0,
        messages=[
            {"role": "user", "content": prompt}
        ],
        functions=[
            {
                "name": "format_video_script",
                "description": "Formats to a 30-45sec video script.",
                "parameters":{
                    "type": "object",
                    "properties": {
                    "list_of_scenes": {
                        "type": "array",
                        "description": "List of scenes for video script, there should be at least 6 scenes or more",
                        "items": {
                        "type": "object",
                        "properties": {
                            "scene": {
                            "type": "string",
                            "description": "Scene description for video should be visual and general. Max 5 words\nExample:family trip skiing | accident bike crash"
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
            }
        ],
        function_call={"name": "format_video_script"}
    )
    print(f'Tokens used VIDEO_SCRIPT_PROMPT: {completion.usage}')
    return completion.choices[0].message
