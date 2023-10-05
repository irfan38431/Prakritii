import openai
from decouple import config

from functions.database import get_recent_messages


# Retrieve Enviornment Variables
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPEN_AI_KEY")


# Open AI - Whisper
# Convert audio to text
def convert_audio_to_text(audio_file):
  try:
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    message_text = transcript["text"]
    return message_text
  except Exception as e:
    print(e)
    print("Audio nahi mila")
    return

# Open AI - Chat GPT
# Convert audio to text
def get_chat_response(message_input):
    messages = get_recent_messages()
    user_message = {"role": "user", "content": message_input}
    messages.append(user_message)

    try:
        # Ensure message content is not None or empty before making the API call
        if message_input and message_input.strip():
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            message_text = response["choices"][0]["message"]["content"]
            return message_text
        else:
            # If message content is None or empty, return an appropriate response
            return "I'm sorry, but I didn't receive a valid message to process."

    except Exception as e:
        print("Error occurred while fetching chat response:")
        print(e)
        # Return a default error message or any appropriate response
        return "I'm sorry, but I couldn't generate a response at the moment. Please try again later."
