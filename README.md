# Simple Webpage for ElevenLabs

A demonstration of using GitHub Copilot to create a static webpage hosted on GitHub Pages. The webpage allows users to convert text to speech using the ElevenLabs API.

## Live Demo

Visit the live demo: [https://haevg-rz.github.io/simple-webpage-for-elevenlabs/](https://haevg-rz.github.io/simple-webpage-for-elevenlabs/)

## Features

- Text-to-speech conversion using ElevenLabs API
- Secure API key management in local storage
- Customizable voice parameters
- Audio playback and download functionality
- Mobile-friendly interface

## Development Process

This project was created in about 20 minutes using GitHub Copilot. Here's the step-by-step process:

1. Created initial `copilot-instructions.md` file
2. Gathered senior developer feedback to improve requirements
3. Refined project requirements in the instructions file
4. Generated project structure:
   ![project structure](https://haevg-rz.github.io/simple-webpage-for-elevenlabs/docs/project_structure.png)
5. Set up GitHub Pages deployment:
   ![view only](https://haevg-rz.github.io/simple-webpage-for-elevenlabs/docs/view_only.png)
6. Implemented core functionality:
   ![working prototype](https://haevg-rz.github.io/simple-webpage-for-elevenlabs/docs/working_prototyp.png)
7. Updated documentation with repository details
8. Finish the readme.md with this prompt: "Fix the typos in #file:README.md and make the file better readable"

### Test Base64 String

```sh
echo "eyJtb2RlbElkIjoiLi4uIiwidm9pY2VJZCI6Ii4uLiIsInByZXZpb3VzVGV4dCI6Ii4uLiIsInRleHQiOiIuLi4iLCJhcGlrZXkiOiIuLi4ifQo=" | base64 -d | jq
# {
#   "modelId": "eleven_multilingual_v2",
#   "voiceId": "...",
#   "previousText": "...",
#   "text": "...",
#   "apikey": "..."
# }
```

```sh
echo '{"modelId":"...","voiceId":"...","previousText":"...","text":"...","apikey":"..."}' | base64 - -w0
# eyJtb2RlbElkIjoiLi4uIiwidm9pY2VJZCI6Ii4uLiIsInByZXZpb3VzVGV4dCI6Ii4uLiIsInRleHQiOiIuLi4iLCJhcGlrZXkiOiIuLi4ifQo=
```

## Repository Structure

The development process is documented in these branches:

1. [setup-copilot](https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/setup-copilot) - Initial setup
2. [project-structure](https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/project-structure) - Basic structure
3. [add-functionality](https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/add-functionality) - Core features

## Add Functionality

### Share Config

I want to add a new feature. As HTML Anchor you should be able to set all parameters and fields with a base64 encoded JSON. So that with a link you can set the API key and the voice ID.

This was a bit tricky to implement, because my prompt was not clear enough.

- Prompt: "Add a new feature. As HTML Anchor you should be able to set all paramater and field with a base64 encoded json. So that with a Link to e..g set the api-key and the voice-id."
- Prompt: "Also add the API key; Remove unnecessary comment"
- Prompt: "There is no DEFAULT_API_KEY"
- Prompt: "create a checkbox for includeApiKey of generateShareableUrl"
