import pinecone
import openai
import numpy as np
import os
from dotenv import load_dotenv

# Langchain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.document_loaders import TextLoader
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA, LLMChain
from langchain.callbacks import wandb_tracing_enabled
from langchain.prompts import (
    PromptTemplate,
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from typing import Optional

from langchain.chains.openai_functions import (
    create_openai_fn_chain,
    create_structured_output_chain,
)
from langchain.schema import HumanMessage, AIMessage, ChatMessage

# wandb
import wandb 

parent_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH_TO_ENV = os.path.join(parent_directory, '.env')
print('PATH_TO_ENV: ', PATH_TO_ENV)

class Singlife:
    """
    Main Wrapper class for Main Langchin

    Assumes the .env variables are in Sn33k directory
    """

    def __init__(self):
        """
        Automatically loads the .env variables
        """
        # Load variables from the .env file
        load_dotenv('../Sn33k/.env')

        # Access the variables
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
        INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
        PINECONE_ENVIRONMENT= os.getenv("PINECONE_ENVIRONMENT")

        openai.api_key = OPENAI_API_KEY
        os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

        # initialize pinecone
        pinecone.init(
            api_key=PINECONE_API_KEY,  # find at app.pinecone.io
            environment=PINECONE_ENVIRONMENT,  # next to api key in console
        )

        index_name = INDEX_NAME

        embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')

        # List all indexes information
        index_description = pinecone.describe_index(index_name)
        print('index_description: ', index_description)

        index = pinecone.Index(index_name) 
        index_stats_response = index.describe_index_stats()
        print('index_stats_response: ', index_stats_response)

        # Create vectorstore
        try:
            self.vectorstore = Pinecone(index, embeddings.embed_query, "text")
            print('vectorstore created succesfully')
        except Exception as e:
            raise Exception(f"Error creating vectorstore: {e}")