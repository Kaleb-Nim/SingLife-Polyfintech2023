from fastapi import FastAPI, Form, Request, status
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import openai
from PineconeUtils.Queryer import PineconeQuery
from dotenv import load_dotenv
import os
from llm.chains import chat
# Load variables from the .env file
load_dotenv('.env')

# Access the variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_ENVIRONMENT= os.getenv("PINECONE_ENVIRONMENT")

# Set the openai api key
openai.api_key = OPENAI_API_KEY
pineconeQuery = PineconeQuery(PINECONE_API_KEY,PINECONE_ENVIRONMENT,INDEX_NAME)

app = FastAPI()
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

# Test POSTMAN query request
@app.post('/query')
async def query(query:str):
    relevant_documents = pineconeQuery.query(query=query)
    relevant_documents_str = pineconeQuery.concatDocuments(relevant_documents)

    sources = pineconeQuery.extractDocumentSources(relevant_documents)
    # Run the LLM 
    video_script = chat(relevant_documents_str,query=query)

    return {"query":query,"relevant_documents":relevant_documents,"video_script":video_script,"sources":sources}

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000)
