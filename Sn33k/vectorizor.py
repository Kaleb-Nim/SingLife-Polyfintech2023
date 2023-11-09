## pip install -U openai pinecone-client jsonlines
## set up pinecone database with 1536 dimensions
import jsonlines
import openai
import pinecone
from dotenv import load_dotenv
import os 
# Load variables from the .env file
load_dotenv('.env')

# Access the variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_ENVIRONMENT= os.getenv("PINECONE_ENVIRONMENT")

# Load train.jsonl file
def load_data(file_path):
    data = []
    with jsonlines.open(file_path) as f:
        for item in f:
            data.append(item)
    return data

# Initialize OpenAI API
def init_openai(api_key):
    openai.api_key = api_key
    return "text-embedding-ada-002"

# Initialize Pinecone index
def init_pinecone(api_key, index_name, dimension):
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
    if index_name not in pinecone.list_indexes():
        pinecone.create_index(index_name, dimension=dimension)
    return pinecone.Index(index_name)

# Create embeddings and populate the index
def create_and_index_embeddings(data, model, index: pinecone.Index):
    print(data)
    batch_size = 32
    for i in range(0, len(data), batch_size):
        text_batch = [item["text"] for item in data[i:i+batch_size]]
        
        source_batch = [item["source"] for item in data[i:i+batch_size]]
        title_batch = [item["title"] for item in data[i:i+batch_size]]
        
        ids_batch = [str(n) for n in range(i, i+min(batch_size, len(data)-i))]
        res = openai.embeddings.create(input=text_batch, model=model)
        embeds = [record.embedding for record in res.data]

        # prep metadata and upsert batch, add source and title and text itself to metadata
        meta = []
        for j in range(len(ids_batch)):
            meta.append({"source": source_batch[j], "title": title_batch[j], "text": text_batch[j]})

        to_upsert = zip(ids_batch, embeds, meta)
        
        index.upsert(vectors=list(to_upsert))

if __name__ == "__main__":
    # Load the data from train.jsonl
    train_data = load_data("train.jsonl")

    # Initialize OpenAI Embedding API
    MODEL = init_openai(OPENAI_API_KEY)

    # Get embeddings dimension
    # sample_embedding = openai.embeddings.create(input="sample text", model=MODEL)["data"][0]["embedding"]
    EMBEDDING_DIMENSION = 1536

    # Initialize Pinecone index
    chatgpt_index = init_pinecone(PINECONE_API_KEY, INDEX_NAME, EMBEDDING_DIMENSION)

    # Create embeddings and populate the index with the train data
    create_and_index_embeddings(train_data, MODEL, chatgpt_index)
