# this is purely for testing purposes of the langchain serving
from langchain import LLMChain, OpenAI, SerpAPIWrapper
from langchain.agents import AgentExecutor, Tool, ZeroShotAgent
import pinecone
import openai
import numpy as np
import os
from dotenv import load_dotenv
import os
from collections import deque
from typing import Dict, List, Optional, Any

from langchain import LLMChain, OpenAI, PromptTemplate
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import BaseLLM
from langchain.vectorstores.base import VectorStore
from pydantic import BaseModel, Field
from langchain.chains.base import Chain
# Langchain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.document_loaders import TextLoader
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA, LLMChain ,LLMCheckerChain
from langchain.callbacks import wandb_tracing_enabled
from langchain.prompts import (
    PromptTemplate,
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.prompts.few_shot import FewShotPromptTemplate

from typing import Optional
from langchain.chains import SimpleSequentialChain ,SequentialChain
from langchain.agents import AgentExecutor, Tool, ZeroShotAgent
from langchain.agents import AgentType, initialize_agent,AgentExecutor
from langchain.tools import tool
from langchain.chains.openai_functions import (
    create_openai_fn_chain,
    create_structured_output_chain,
)
from langchain.schema import HumanMessage, AIMessage, ChatMessage
from lcserve import serving


from elevenlabs import generate as generate_voice, set_api_key, voices

import whisper_timestamped as whisper

# Azure Blob
from azure.storage.blob import BlobServiceClient

from datetime import datetime, timedelta
import json

AZURE_STORAGE_KEY_1 = os.getenv("AZURE_STORAGE_KEY_1")
connection_string = AZURE_STORAGE_KEY_1
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
account_name = connection_string.split(';')[1].split('=')[1]
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_ENVIRONMENT= os.getenv("PINECONE_ENVIRONMENT")

# ELEVENLABS
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
set_api_key(ELEVENLABS_API_KEY)

MODEL_NAME = "gpt-4-0613"
TEMPERATURE = 0.0
class VideoGenerator:
    
    # task_list: deque = Field(default_factory=deque)
    video_chain2: Chain = Field(default_factory=Chain)
    
    def __init__(self,llm):
        
        pinecone.init(
            api_key=PINECONE_API_KEY,  # find at app.pinecone.io
            environment=PINECONE_ENVIRONMENT,  # next to api key in console
        )

        index_name = "singlife"

        embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')
        # if you already have an index, you can load it like this
        docsearch = Pinecone.from_existing_index(index_name, embeddings)
        self.retriever = docsearch.as_retriever(search_type="mmr")

        self.task_list = deque([{"task_id": 1, "task_name": "Extract relevant documents from Pinecone based on objective"}, {"task_id": 2, "task_name": "Format information to generate 15-30sec video script. VideoStyle: Funny and sarcastic, parse out as JSON output."}])
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

        video_prompt_style ="Funny and sarcastic"
        video_prompt = PromptTemplate(
            template="""Goal:Generate 15-30sec video script based on custom knowledge base (Information below) and user query. Two components 1.Scene assets descriptions (Max 5 words) 2.Subtitle script 
            Custom knowledge base:{relevant_documents}\n\nUsing the above information, generate a video script that addresses this user query:\n\n"{query}".\nReturn the generated video script in the style/format: Funny and sarcastic""",
            input_variables= ["relevant_documents", "query"]
        )
        self.video_chain2 = create_structured_output_chain(json_schema2, llm, video_prompt, verbose=True)

    def print_task_list(self):
        print("\033[95m\033[1m" + "\n*****TASK LIST*****\n" + "\033[0m\033[0m")
        for t in self.task_list:
            # print('t: ', t)
            print(str(t["task_id"]) + ": " + t["task_name"])

    def print_next_task(self, task: Dict):
        print("\033[92m\033[1m" + "\n*****NEXT TASK*****\n" + "\033[0m\033[0m")
        print(str(task["task_id"]) + ": " + task["task_name"])

    def print_task_result(self, result: str):
        print("\033[93m\033[1m" + "\n*****TASK RESULT*****\n" + "\033[0m\033[0m")
        print(result)

      
    def getPineconeRelevantDocuments(self,query):
        """
        Parameters:
            query (str): query to search for relevant documents in database
        Returns:
            relevant_documents (str): relevant documents in database based on query
        """
        relevant_documents = ""
        matched_docs = self.retriever.get_relevant_documents("I am travelling to Japan for a ski trip with my family next week.What kind of travel insurance coverage do we need?")

        for i, d in enumerate(matched_docs):
            # print(f"\n## Document {i}\n")
            # print(d.page_content)
            relevant_documents += f'\n## Document {i}\n {d.page_content}'
            
        return relevant_documents
    
    def generate(self,query):
        self.print_task_list()
        
        # Step 1: Pull the first task
        task = self.task_list.popleft()
        self.print_next_task(task)

        relevant_documents = self.getPineconeRelevantDocuments(query)
        
        self.print_task_result(relevant_documents)
        
        # Step 2: Add the next task
        self.print_next_task(task)
        results = self.video_chain2.run(relevant_documents=relevant_documents, query=query)
        self.print_task_result(results)

        # check if results is a string or a dict
        if not isinstance(results, dict):
            print(f'warning, results is not a dict, it is a {type(results)}')

        return results

    

    

@serving
def generate(input: str) -> dict:
    videoGenerator = VideoGenerator(llm=ChatOpenAI(model_name=MODEL_NAME, temperature=TEMPERATURE))
    output = videoGenerator.generate(input)
    all_subtitles_list = []
    for scene in output["list_of_scenes"]:
        all_subtitles_list.append(" ".join(scene["subtitles"]))
    all_subtitles = " ".join(all_subtitles_list)
    audio = generate_voice(
        text=all_subtitles,
        voice="Jeremy",
        model="eleven_monolingual_v1"
    )
    current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    container_name = "audio"
    blob_name = f"demo_{current_time}.mp3"

    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    blob_client.upload_blob(audio, overwrite=True)

    blob_uri = blob_client.url

    with open(blob_name, 'wb') as f:
        f.write(audio)
        f.close()

    audio = whisper.load_audio(blob_name)
    model = whisper.load_model("base")

    result = whisper.transcribe(model, audio, language="en")

    srt_file = ""

    for i, segment in enumerate(result['segments']):
        start, end = segment['start'], segment['end']
        srt_file += f"{i + 1}\n00:00:{str(int(start)).replace('.', ',')} --> 00:00:{str(int(end)).replace('.', ',')}\n{segment['text'].strip()}\n"
    
    return {
        "video": output,
        "audio": blob_uri,
        "srt": srt_file
    }

@serving
def ask(input: str) -> str:
    search = SerpAPIWrapper()
    tools = [
        Tool(
            name="Search",
            func=search.run,
            description="useful for when you need to answer questions about current events",
        )
    ]
    prefix = """Answer the following questions as best you can, but speaking as a pirate might speak. You have access to the following tools:"""
    suffix = """Begin! Remember to speak as a pirate when giving your final answer. Use lots of "Args"

    Question: {input}
    {agent_scratchpad}"""

    prompt = ZeroShotAgent.create_prompt(
        tools,
        prefix=prefix,
        suffix=suffix,
        input_variables=["input", "agent_scratchpad"],
    )

    print(prompt.template)

    llm_chain = LLMChain(llm=OpenAI(temperature=0), prompt=prompt)
    tool_names = [tool.name for tool in tools]
    agent = ZeroShotAgent(llm_chain=llm_chain, allowed_tools=tool_names)

    agent_executor = AgentExecutor.from_agent_and_tools(
        agent=agent, tools=tools, verbose=True
    )

    return agent_executor.run(input)


if __name__ == "__main__":
    print(ask("What is the capital of France?"))
