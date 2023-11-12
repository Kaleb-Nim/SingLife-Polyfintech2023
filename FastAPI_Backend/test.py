import asyncio
from openai import AsyncAzureOpenAI
import os 
from dotenv import load_dotenv

load_dotenv()

client = AsyncAzureOpenAI(
    azure_endpoint=os.getenv("OPENAI_API_ENDPOINT"), 
    api_key=os.getenv("OPENAI_API_KEY"),  
    api_version=os.getenv("OPENAI_API_VERSION"),
)

async def main():
  completion = await client.chat.completions.create(
      model=os.getenv("OPENAI_API_ENGINE"),  # e.g. gpt-35-instant
      messages=[
          {
              "role": "user",
              "content": "How do I output all files in a directory using Python?",
          },
      ],
  )
  print(completion.model_dump_json(indent=2))

# main()

loop = asyncio.get_event_loop()

# Use the event loop to run the main function
loop.run_until_complete(main())
