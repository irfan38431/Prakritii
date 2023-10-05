import requests
from decouple import config

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

# Eleven Labs
# Convert text to speech
def convert_text_to_speech(message):
  body = {
    "text": message,
    "voice_settings": {
        "stability": 0,
        "similarity_boost": 0
    }
  }

  
  voice_rachel = "21m00Tcm4TlvDq8ikWAM"


  # Construct request headers and url
  headers = { "xi-api-key": ELEVEN_LABS_API_KEY, "Content-Type": "application/json", "accept": "audio/mpeg" }
  endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_rachel}"

  try:
    response = requests.post(endpoint, json=body, headers=headers)
    print(response)
    print("response milgaya")
  except Exception as e:
     print("bhaiya not working")
     print(e)
     return

  if response.status_code == 200:
      # with open("output.wav", "wb") as f:
      #     f.write(audio_data)
      return response.content
  else:
    return