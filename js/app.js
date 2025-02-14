// Default values
const DEFAULT_VALUES = {
    modelId: 'eleven_multilingual_v2',
    voiceId: 'y8FeN9lFTEmQOYCaE07F',
    previousText: ''
};

// Storage keys
const STORAGE_KEYS = {
    apiKey: 'elevenlabs_api_key',
    modelId: 'elevenlabs_model_id',
    voiceId: 'elevenlabs_voice_id',
    previousText: 'elevenlabs_previous_text'
};

// DOM Elements
const elements = {
    apiKey: document.getElementById('apiKey'),
    apiKeySection: document.getElementById('apiKeySection'),
    saveApiKey: document.getElementById('saveApiKey'),
    removeApiKey: document.getElementById('removeApiKey'),
    text: document.getElementById('text'),
    previousText: document.getElementById('previousText'),
    modelId: document.getElementById('modelId'),
    voiceId: document.getElementById('voiceId'),
    resetParams: document.getElementById('resetParams'),
    generateVoice: document.getElementById('generateVoice'),
    audioSection: document.getElementById('audioSection'),
    audioPlayer: document.getElementById('audioPlayer'),
    downloadAudio: document.getElementById('downloadAudio')
};

let currentAudioBlob = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadStoredValues();
    setupEventListeners();
});

function loadStoredValues() {
    // Load API Key and show/hide sections
    const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey);
    if (apiKey) {
        elements.apiKey.value = apiKey;
    }

    // Load other parameters
    elements.modelId.value = localStorage.getItem(STORAGE_KEYS.modelId) || DEFAULT_VALUES.modelId;
    elements.voiceId.value = localStorage.getItem(STORAGE_KEYS.voiceId) || DEFAULT_VALUES.voiceId;
    elements.previousText.value = localStorage.getItem(STORAGE_KEYS.previousText) || DEFAULT_VALUES.previousText;
}

function setupEventListeners() {
    elements.saveApiKey.addEventListener('click', saveApiKey);
    elements.removeApiKey.addEventListener('click', removeApiKey);
    elements.resetParams.addEventListener('click', resetParameters);
    elements.generateVoice.addEventListener('click', generateVoice);
    elements.downloadAudio.addEventListener('click', downloadAudio);

    // Save parameters on change
    elements.modelId.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.modelId, elements.modelId.value));
    elements.voiceId.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.voiceId, elements.voiceId.value));
    elements.previousText.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.previousText, elements.previousText.value));
}

function saveApiKey() {
    const apiKey = elements.apiKey.value.trim();
    if (apiKey) {
        localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
        alert('API Key saved successfully!');
    }
}

function removeApiKey() {
    localStorage.removeItem(STORAGE_KEYS.apiKey);
    elements.apiKey.value = '';
    alert('API Key removed!');
}

function resetParameters() {
    elements.modelId.value = DEFAULT_VALUES.modelId;
    elements.voiceId.value = DEFAULT_VALUES.voiceId;
    elements.previousText.value = DEFAULT_VALUES.previousText;
    
    localStorage.setItem(STORAGE_KEYS.modelId, DEFAULT_VALUES.modelId);
    localStorage.setItem(STORAGE_KEYS.voiceId, DEFAULT_VALUES.voiceId);
    localStorage.setItem(STORAGE_KEYS.previousText, DEFAULT_VALUES.previousText);
}

async function generateVoice() {
    const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey);
    if (!apiKey) {
        alert('Please save your API key first!');
        return;
    }

    const text = elements.text.value.trim();
    if (!text) {
        alert('Please enter some text to convert!');
        return;
    }

    elements.generateVoice.disabled = true;
    elements.generateVoice.textContent = 'Generating...';

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${elements.voiceId.value}?output_format=mp3_44100_128`,
            {
                method: 'POST',
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    model_id: elements.modelId.value,
                    previous_text: elements.previousText.value
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const audioBlob = await response.blob();
        currentAudioBlob = audioBlob;
        
        const audioUrl = URL.createObjectURL(audioBlob);
        elements.audioPlayer.src = audioUrl;
        elements.audioSection.classList.remove('d-none');
        elements.audioPlayer.play();

    } catch (error) {
        alert('Error generating voice: ' + error.message);
    } finally {
        elements.generateVoice.disabled = false;
        elements.generateVoice.textContent = 'Generate Voice';
    }
}

function downloadAudio() {
    if (!currentAudioBlob) {
        alert('No audio available to download!');
        return;
    }

    const downloadUrl = URL.createObjectURL(currentAudioBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'generated-voice.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
}
