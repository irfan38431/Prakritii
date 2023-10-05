# uvicorn main:app
# uvicorn main:app --reload

# Main imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
from pydantic import BaseModel

import openai
import logging 

# Custom function imports
from functions.text_to_speech import convert_text_to_speech
from functions.openai_requests import convert_audio_to_text, get_chat_response
from functions.database import store_messages, reset_messages


# Get Environment Vars
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")


# Initiate App
app = FastAPI()

class TextMessageRequest(BaseModel):
    textMessage: str

# Configure logging settings
logging.basicConfig(
    filename='app.log',  # Specify the log file location
    level=logging.DEBUG,  # Set the log level (e.g., DEBUG, INFO, ERROR)
    format='%(asctime)s [%(levelname)s] %(message)s',
)

# CORS - Origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:4174",
    "http://localhost:3000",
    "http://localhost:8000",
]


# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Check health
@app.get("/health")
async def check_health():
    return {"response": "healthy"}


# Reset Conversation
@app.get("/reset")
async def reset_conversation():
    reset_messages()
    return {"response": "conversation reset"}


# Post bot response for audio
@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):

    # Convert audio to text - production
    # Save the file temporarily
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
        print("file read hogaya")
    audio_input = open(file.filename, "rb")

    # Decode audio
    message_decoded = convert_audio_to_text(audio_input)

    # Guard: Ensure output
    if not message_decoded:
        print("decode naahi hua")
        raise HTTPException(status_code=400, detail="Failed to decode audio")

    # Get chat response
    chat_response = get_chat_response(message_decoded)
    if chat_response:
        print("response milgaya,Aage bado bhai")
    # Store messages
    store_messages(message_decoded, chat_response)

    # Guard: Ensure output
    if not chat_response:
        print("response nahi milaya")
        raise HTTPException(status_code=400, detail="Failed chat response")

    # Convert chat response to audio
    audio_output = convert_text_to_speech(chat_response)

    # Guard: Ensure output
    if not audio_output:
        print("text to speech problem hai,check this nahi toh text_to_speech.py")
        raise HTTPException(status_code=400, detail="Failed audio output")

    # Create a generator that yields chunks of data
    def iterfile():
        yield audio_output

    # Use for Post: Return output audio
    return StreamingResponse(iterfile(), media_type="application/octet-stream")


# Send text message and get chatbot response
@app.post("/send-text-message")
async def send_text_message(message: TextMessageRequest):
    # Retrieve the text message from the request body
    text_message = message.textMessage

    # Log the incoming message
    logging.info(f'Incoming message: {text_message}')

    chat_response = get_chat_response(text_message)

    # Log the chat response
    if chat_response:
        logging.info(f'Chatbot response: {chat_response}')
        print("response milgaya")
    else:
        logging.error('Chatbot response not received')

    # Store messages
    store_messages(text_message, chat_response)

    # Guard: Ensure output
    if not chat_response:
        logging.error('Failed chat response')
        raise HTTPException(status_code=400, detail="Failed chat response")

    reply_message = chat_response

    # Return the chatbot's reply
    return {"reply_message": reply_message}  # Return JSON response