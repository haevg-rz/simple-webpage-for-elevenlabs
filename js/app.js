const DEFAULT_VALUES = {
    modelId: 'eleven_multilingual_v2',
    voiceId: 'y8FeN9lFTEmQOYCaE07F',
    previousText: '',
    speed: 1.0,
    stability: 0.75,
    similarityBoost: 0.75,
    style: 0
};

const STORAGE_KEYS = {
    apiKey: 'elevenlabs_api_key',
    modelId: 'elevenlabs_model_id',
    voiceId: 'elevenlabs_voice_id',
    previousText: 'elevenlabs_previous_text',
    // Add keys for slider
    speed: 'elevenlabs_speed', // Store name of speed value, to use as key later on
    stability: 'elevenlabs_stability',
    similarityBoost: 'elevenlabs_similarity_boost',
    style: 'elevenlabs_style'
};

const PARAM_KEY = 'config';

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
    downloadAudio: document.getElementById('downloadAudio'),

    // Add references to the new sliders
    speedSlider: document.getElementById('speedSlider'),
    stabilitySlider: document.getElementById('stabilitySlider'),
    similarityBoostSlider: document.getElementById('similarityBoostSlider'),
    styleSlider: document.getElementById('styleSlider'),
    resetParams: document.getElementById('resetParams'),
    generateVoice: document.getElementById('generateVoice'),
    audioSection: document.getElementById('audioSection'),
    audioPlayer: document.getElementById('audioPlayer'),
    downloadAudio: document.getElementById('downloadAudio'),

    // Add references to display values for sliders
    speedValueDisplay: document.getElementById('speedValueDisplay'),
    stabilityValueDisplay: document.getElementById('stabilityValueDisplay'),
    similarityBoostValueDisplay: document.getElementById('similarityBoostValueDisplay'),
    styleValueDisplay: document.getElementById('styleValueDisplay')
};

let currentAudioBlob = null;

document.addEventListener('DOMContentLoaded', () => {
    loadParametersFromUrl();
    loadStoredValues();
    setupEventListeners();
});

function loadStoredValues() {
    // Load API Key if exists
    const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey);
    if (apiKey) {
        elements.apiKey.value = apiKey;
    }

    elements.modelId.value = localStorage.getItem(STORAGE_KEYS.modelId) || DEFAULT_VALUES.modelId;
    elements.voiceId.value = localStorage.getItem(STORAGE_KEYS.voiceId) || DEFAULT_VALUES.voiceId;
    elements.previousText.value = localStorage.getItem(STORAGE_KEYS.previousText) || DEFAULT_VALUES.previousText;

     // Load slider values and update their displays
    if (elements.speedSlider && elements.speedValueDisplay) { //in case the script is loaded in the wrong order
        elements.speedSlider.value = localStorage.getItem(STORAGE_KEYS.speed) || DEFAULT_VALUES.speed; //lade das gespeicherte speed unter storage key, wenn das nicht funktioniert nutze das default value
        elements.speedValueDisplay.textContent = elements.speedSlider.value;
    }
    if (elements.stabilitySlider && elements.stabilityValueDisplay) {
        elements.stabilitySlider.value = localStorage.getItem(STORAGE_KEYS.stability) || DEFAULT_VALUES.stability;
        elements.stabilityValueDisplay.textContent = elements.stabilitySlider.value;
    }
    if (elements.similarityBoostSlider && elements.similarityBoostValueDisplay) {
        elements.similarityBoostSlider.value = localStorage.getItem(STORAGE_KEYS.similarityBoost) || DEFAULT_VALUES.similarityBoost;
        elements.similarityBoostValueDisplay.textContent = elements.similarityBoostSlider.value;
    }
    if (elements.styleSlider && elements.styleValueDisplay) {
        elements.styleSlider.value = localStorage.getItem(STORAGE_KEYS.style) || DEFAULT_VALUES.style;
        elements.styleValueDisplay.textContent = elements.styleSlider.value;
    }

    //ake sliders visible after local Storage values are set
    const slidersContainer = document.getElementById('voiceSettingsSliders'); //html id of all sliders
    if (slidersContainer) { 
        slidersContainer.classList.remove('sliders-loading'); //remove css class hiding sliders
    }
}

function setupEventListeners() {
    elements.saveApiKey.addEventListener('click', saveApiKey);
    elements.removeApiKey.addEventListener('click', removeApiKey);
    elements.resetParams.addEventListener('click', resetParameters);
    elements.generateVoice.addEventListener('click', generateVoice);
    elements.downloadAudio.addEventListener('click', downloadAudio);

    elements.modelId.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.modelId, elements.modelId.value));
    elements.voiceId.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.voiceId, elements.voiceId.value));
    elements.previousText.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.previousText, elements.previousText.value));
    
    //update slider values
     if (elements.speedSlider && elements.speedValueDisplay) {
        elements.speedSlider.addEventListener('input', () => {
            elements.speedValueDisplay.textContent = elements.speedSlider.value; // Update the display value
            localStorage.setItem(STORAGE_KEYS.speed, elements.speedSlider.value); // Save speed to localStorage, every time the slider is moved
        });
    }
    if (elements.stabilitySlider && elements.stabilityValueDisplay) { 
        elements.stabilitySlider.addEventListener('input', () => {
            elements.stabilityValueDisplay.textContent = elements.stabilitySlider.value;
            localStorage.setItem(STORAGE_KEYS.stability, elements.stabilitySlider.value); 
        });
    }
    if (elements.similarityBoostSlider && elements.similarityBoostValueDisplay) { 
        elements.similarityBoostSlider.addEventListener('input', () => {
            elements.similarityBoostValueDisplay.textContent = elements.similarityBoostSlider.value;
            localStorage.setItem(STORAGE_KEYS.similarityBoost, elements.similarityBoostSlider.value); 
        });
    }
    if (elements.styleSlider && elements.styleValueDisplay) { 
        elements.styleSlider.addEventListener('input', () => {
            elements.styleValueDisplay.textContent = elements.styleSlider.value;
            localStorage.setItem(STORAGE_KEYS.style, elements.styleSlider.value); 
        });
    } 

     // Initialize Bootstrap Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    document.getElementById('shareUrl').addEventListener('click', () => {
        const includeApiKey = document.getElementById('includeApiKey').checked;
        const url = generateShareableUrl(includeApiKey);
        navigator.clipboard.writeText(url)
            .then(() => alert('Shareable URL copied to clipboard!'))
            .catch(err => console.error('Failed to copy URL:', err));
    });
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
                    previous_text: elements.previousText.value,
                    voice_settings:
                    {
                        speed: parseFloat(elements.speedSlider.value),
                        stability: parseFloat(elements.stabilitySlider.value),
                        similarity_boost: parseFloat(elements.similarityBoostSlider.value),
                        style: parseFloat(elements.styleSlider.value)
                    }
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

function loadParametersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get(PARAM_KEY);

    if (configParam) {
        try {
            const config = JSON.parse(atob(configParam));
            applyConfig(config);
            window.history.replaceState({}, '', window.location.pathname);
        } catch (error) {
            console.error('Failed to parse URL parameters:', error);
        }
    }
}

function applyConfig(config) {
    if (config.apiKey) {
        elements.apiKey.value = config.apiKey;
        saveApiKey();
    }
    if (config.modelId) {
        elements.modelId.value = config.modelId;
        localStorage.setItem(STORAGE_KEYS.modelId, config.modelId);
    }
    if (config.voiceId) {
        elements.voiceId.value = config.voiceId;
        localStorage.setItem(STORAGE_KEYS.voiceId, config.voiceId);
    }
    if (config.previousText) {
        elements.previousText.value = config.previousText;
        localStorage.setItem(STORAGE_KEYS.previousText, config.previousText);
    }
    if (config.text) {
        elements.text.value = config.text;
    }
}

function generateShareableUrl(includeApiKey = false) {
    const config = {
        modelId: elements.modelId.value,
        voiceId: elements.voiceId.value,
        previousText: elements.previousText.value,
        text: elements.text.value
    };

    if (includeApiKey) {
        config.apiKey = elements.apiKey.value;
    }

    const base64Config = btoa(JSON.stringify(config));
    const url = new URL(window.location.href);
    url.search = `?${PARAM_KEY}=${base64Config}`;
    return url.toString();
}
