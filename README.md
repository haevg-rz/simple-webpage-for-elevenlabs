# simple-webpage-for-elevenlabs

I want to demonstrate how to use copilot to create a simple static webpage which should be hosted on GitHub Pages.

## Use Case

The purpose of this webpage is to create a voice from text with the usage of the elevenlabs API.

## Result

After 20min I have a working prototype of a simple static webpage which is hosted on GitHub Pages. I can create a voice from text by sending the request to the elevenlabs API. I can play the voice (mp3) in the browser and download the voice (mp3) from the browser.

## Steps

1. Creating the copilot-instructions.md file
2. Get Feedback "What would a Senior Developer have for question when reading this discerption of a software project?"
3. Adapt some of this to the copilot-instructions.md file
4. Github Copilot Edits Prompt: "Create all the files for a simple, non-functional prototype to demonstrate the structure of the project, remembering that this should be hosted on github pages."
   ![project structure](https://haevg-rz.github.io/simple-webpage-for-elevenlabs/docs/project_structure.png)

5. Follow up prompt: "How to setup Github Pages?" and follow the instructions
   ![view only](https://haevg-rz.github.io/simple-webpage-for-elevenlabs/docs/view_only.png)
6. Follow up prompt: "Set Default values in view; Implement everthing, like storage, default values, api call, playpack and download of the response mp3 file"
   ![working prototyp](https://haevg-rz.github.io/simple-webpage-for-elevenlabs/docs/working_prototyp.png)
7. Update the copilot-instructions.md with the repo url and github pages url

### Branches

1. setup-copilot [https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/setup-copilot](https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/setup-copilot)
2. project-structure [https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/project-structure](https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/project-structure)
3. add-functionality [https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/add-functionality](https://github.com/haevg-rz/simple-webpage-for-elevenlabs/tree/add-functionality)