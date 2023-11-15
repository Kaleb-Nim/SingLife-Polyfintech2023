import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import os
from openai import AzureOpenAI
# Load variables from the .env file
load_dotenv('.env')



client = AzureOpenAI(
  api_key = os.getenv("OPENAI_API_KEY"),  
  api_version = os.getenv("OPENAI_API_VERSION"),
  azure_endpoint =os.getenv("OPENAI_API_ENDPOINT") 
)

response = client.embeddings.create(
    input = "Your text string goes here",
    model= os.getenv("OPENAI_API_EMBED")
)

print(response.model_dump_json(indent=2))