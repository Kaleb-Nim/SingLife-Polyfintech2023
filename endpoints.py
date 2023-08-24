import os
from typing import Union

from pydantic import BaseModel

from fastapi import FastAPI

from elevenlabs import generate, set_api_key, voices

import whisper_timestamped as whisper

app = FastAPI()

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]

set_api_key(ELEVENLABS_API_KEY)

@app.get("/status")
def read_root():
    return {"Hello": "World"}

@app.get("/voices")
def get_voices():
    print("hi")
    return "voices()"

class VoiceBody(BaseModel):
    text: str
    voice_id: str | None = None

@app.post("/voice/demo")
def post_demo_voice(voiceBody: VoiceBody):
    print(voiceBody)
    # audio = generate(
    #     text=voiceBody.text,
    #     voice="Jeremy",
    #     model="eleven_monolingual_v1"
    # )
    # with open("demo.mp3", 'wb') as f:
    #     f.write(audio)
    #     f.close()
    return "audio"

@app.get("/voice/demo")
def get_demo_voice():
    audio = whisper.load_audio('demo.mp3')
    model = whisper.load_model("base")

    result = whisper.transcribe(model, audio, language="en")

    import json
    print(json.dumps(result, indent = 2, ensure_ascii = False))
    return result
