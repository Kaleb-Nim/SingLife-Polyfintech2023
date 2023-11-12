from fastapi import FastAPI, Form, Request, status
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import openai
from openai import AsyncAzureOpenAI
from PineconeUtils.Queryer import PineconeQuery
from dotenv import load_dotenv
import os
from llm.chains import generate_video
from utils import formatQuery,parse_json_output
from pydantic import BaseModel
from typing import Optional
# Load variables from the .env file
load_dotenv('.env')
from fastapi.middleware.cors import CORSMiddleware

# Set the openai api key
client = AsyncAzureOpenAI(
    azure_endpoint=os.getenv("OPENAI_API_ENDPOINT"), 
    api_key=os.getenv("OPENAI_API_KEY"),  
    api_version=os.getenv("OPENAI_API_VERSION"),
)

# Access the variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_ENVIRONMENT= os.getenv("PINECONE_ENVIRONMENT")

pineconeQuery = PineconeQuery(PINECONE_API_KEY,PINECONE_ENVIRONMENT,INDEX_NAME)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    print('Request for index page received')
    return templates.TemplateResponse('index.html', {"request": request})

@app.get('/favicon.ico')
async def favicon():
    file_name = 'favicon.ico'
    file_path = './static/' + file_name
    return FileResponse(path=file_path, headers={'mimetype': 'image/vnd.microsoft.icon'})

@app.post('/hello', response_class=HTMLResponse)
async def hello(request: Request, name: str = Form(...)):
    if name:
        print('Request for hello page received with name=%s' % name)
        return templates.TemplateResponse('hello.html', {"request": request, 'name':name})
    else:
        print('Request for hello page received with no name or blank name -- redirecting')
        return RedirectResponse(request.url_for("index"), status_code=status.HTTP_302_FOUND)

class UserInfo(BaseModel):
    name: str
    age: Optional[int] = None
    concerns: str
    needs: Optional[str] = None
    lifestyle: Optional[str] = None

# Test POSTMAN query request
@app.post('/query')
async def query(UserInfo:UserInfo):
    """Sample UserInfo must contain the following keys:
        name: str,
        age: Optional[int] = None,
        concerns:str,
        needs:Optional[str] = None,
        lifestyle:Optional[str] = None,
    """    
    query_dict = formatQuery(UserInfo) 
    relevant_documents = pineconeQuery.query(query=query_dict['pinecone_query'])

    relevant_documents_str = pineconeQuery.concatDocuments(relevant_documents)
    sources = pineconeQuery.extractDocumentSources(relevant_documents)

    # Filter out the relevant documents


    # Run the LLM for video generation
    video_script = generate_video(relevant_documents_str,query=query_dict['user_query'])
    video_script_json = parse_json_output(video_script)

    return {"query":query_dict['user_query'],"relevant_documents":relevant_documents,"video_script":video_script_json,"sources":sources}

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
