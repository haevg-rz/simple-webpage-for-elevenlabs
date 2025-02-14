Help me with creating a simple static webpage which should be hosted on GitHub Pages.
The purpose of this webpage is to create a voice from text with the usage of the elevenlabs API.

# Feature

This simple static webpage should have the following features

- Saving and Removing the API Key in local storage
- If the API Key is not saved, the user should be prompted to enter the API Key
- Large textarea to input the text (parameter of the request json "text")
- section with all parameters to create the voice
  - previous_text (parameter of the request json "previous_text", default is empty)
  - model_id (parameter of the request json "model_id", default is: "eleven_multilingual_v2")
  - voice_id (is part of the url, default is: "y8FeN9lFTEmQOYCaE07F")
- all parameters should be saved in local storage
- all parameters should be loaded from local storage on load
- all parameters can be reset to default values
- Button to create the voice (mp3) from the text by sending the request to the elevenlabs API
- Be able to play the voice (mp3) in the browser
- Be able to download the voice (mp3) from the browser
- The GUI should be very simple but working on mobile and desktop

# Details

- Tech stack: HTML, CSS, JavaScript, Bootstrap

# Technical Demonstration

Url is: `https://api.elevenlabs.io/v1/text-to-speech/{{voice_id}}?output_format=mp3_44100_128`

```bash
curl --location 'https://api.elevenlabs.io/v1/text-to-speech/y8FeN9lFTEmQOYCaE07F?output_format=mp3_44100_128' \
--header 'xi-api-key: SECRET-API-KEY' \
--header 'Content-Type: application/json' \
--data '{
    "previous_text": "Ich bin eine freundliche KI.",
    "text": "Herzlich Willkommen",
    "model_id": "eleven_multilingual_v2"
}'
```

Relevant Response Headers:

```plain
content-type: audio/mpeg
```
