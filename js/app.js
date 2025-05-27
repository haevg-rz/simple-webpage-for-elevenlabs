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
    
    audioSection: document.getElementById('audioSection'), //Setup Audio Section

    // Default Audio Player Elements

    audioPlayer: document.getElementById('audioPlayer'),
    downloadAudio: document.getElementById('downloadAudio'),
    
    // Telephone Audio Player Elements
    audioPlayerTelephone: document.getElementById('audioPlayerTelephone'),
    downloadAudioTelephone: document.getElementById('downloadAudioTelephone'),

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
            `https://api.elevenlabs.io/v1/text-to-speech/${elements.voiceId.value}?output_format=mp3_44100_128 `, //mp3_44100_128 //mp3_22050_32
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
        //Default Audio Player
        // 1. Get the audio data from the API response
        const audioBlob = await response.blob();
        currentAudioBlob = audioBlob;
        // 2. Create a URL for the audio blob
        const audioUrl = URL.createObjectURL(audioBlob);
        // 3. Set up the audio player
        elements.audioPlayer.src = audioUrl;  // Set the audio source
       
        // elements.audioPlayer.play();  // Start playing

        //Telephone Audio Player
        // elements.audioPlayerTelephone.src = audioUrl; //assign the same audio URL to the telephone player
        const telephoneAudioBlob = await convertToTelephoneQualitySpeed(audioBlob);
        const telephoneAudioUrl = URL.createObjectURL(telephoneAudioBlob);
        elements.audioPlayerTelephone.src = telephoneAudioUrl;
        
        
        elements.audioSection.classList.remove('d-none'); // Make both players visible

    } catch (error) {
        alert('Error generating voice: ' + error.message);
    } finally {
        elements.generateVoice.disabled = false;
        elements.generateVoice.textContent = 'Generate Voice';
    }
}
// This function uses the Web Audio API, which implements Audio Graphs as an Audio Processing Pipeline
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#audio_graphs
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#audio_graphs

// AudioBuffer represents the raw audio data that can be processed by the Web Audio API.
// The OfflineAudioContext is used to render audio data offline, allowing for processing without real-time playback.
// We're using the OfflineAudioContext to change the sample rate of the audio data. Since AudioBuffers are immutable,
// we need to create a new Buffer. Since we're not playing the audio directly but processing it,
// we use the OfflineAudioContext to render the audio data offline.
// The source node is used to transfer audio data from the original Buffer (old sample rate) to the new Buffer (new sample rate).

// Audio Buffers, frames, and channels are explained here: 
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#audio_buffers_frames_samples_and_channels
// The Web Audio API cannot encode MP3 directly, so we use lamejs to encode the audio data to MP3 format
async function convertToTelephoneQualitySpeed(audioBlob) {
    try {
        // Audio context is required for using the Web Audio API
        // We prepare an audioBuffer since only the audioBuffer can have its sample rate changed
        
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer()); // Decodes audio data to a format that can be processed by the Web Audio API
        const targetRate = 8000;

        // Create offline context with new sample rate 
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#offlinebackground_audio_processing
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#audio_buffers_frames_samples_and_channels
        const offlineCtx = new OfflineAudioContext(
            1, // mono
            Math.round(audioBuffer.length * (8000 / audioBuffer.sampleRate)), // Calculate new length based on target sample rate: https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext/length
            8000 // Set target sample rate to 8000Hz (telephone quality)
        );

        // To feed audio data through the processing pipeline, we create a source node with our audioBuffer
        // Reference: https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer#example
        const source = offlineCtx.createBufferSource(); // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
        source.buffer = audioBuffer;
        
        // Connect the source to the destination to establish the audio pipeline
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#modifying_sound
        source.connect(offlineCtx.destination); // Connect audio pipeline to destination
        source.start(); // Send audio through the audio pipeline/graph to the destination we just set up

        // Start rendering performs the actual conversion
        const renderedBuffer = await offlineCtx.startRendering(); // Apply changes and render to a new AudioBuffer with the new sample rate
        
        // renderedBuffer is our new AudioBuffer with the new sample rate (8000Hz)
        // Now this data needs to be encoded to MP3 format using lamejs
        
        const inputData = renderedBuffer.getChannelData(0); // Get mono channel data

        // Convert float32 to Int16Array as required by lamejs
        // https://github.com/zhuker/lamejs#usage -> lamejs expects 16-bit PCM samples
        const samples = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
            samples[i] = inputData[i] * 32767; // Convert from [-1.0, +1.0] float range to [-32768, +32767] int16 range
        }

        // Create MP3 encoder with the telephone quality sample rate
        // Code follows the Quick Start Guide of lamejs:
        const mp3encoder = new lamejs.Mp3Encoder( // Using lamejs for MP3 encoding
            1,           // channels (mono)
            targetRate,  // sample rate (8000Hz for telephone quality)
            32           // bitrate (low for telephone quality)
        );

        // Encode and combine
        const mp3Data = mp3encoder.encodeBuffer(samples); // Encode the samples to MP3 format
        const mp3Final = mp3encoder.flush(); // Finalize the encoding process

        return new Blob([mp3Data, mp3Final], { type: 'audio/mp3' });
    } catch (error) {
        console.error('Error:', error);
        throw error;
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
