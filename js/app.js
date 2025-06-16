//Global Variables
let currentAudioBlob = null;
let telephoneAudioBlob = null;

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

const elementIds = {
    // key: id in HTML
    apiKey: 'apiKey',
    apiKeySection: 'apiKeySection',
    saveApiKey: 'saveApiKey',
    removeApiKey: 'removeApiKey',
    text: 'text',
    previousText: 'previousText',
    modelId: 'modelSelect', // rename templateSelect to modelId
    voiceId: 'voiceId',
    resetParams: 'resetParams',
    generateVoice: 'generateVoice',
    audioSectionQuality: 'audioSectionQuality',
    audioSectionTel: 'audioSectionTel',
    audioPlayer: 'audioPlayer',
    downloadAudio: 'downloadAudio',
    audioPlayerTelephone: 'audioPlayerTelephone',
    downloadAudioTelephone: 'downloadAudioTelephone',
    speedSlider: 'speedSlider',
    stabilitySlider: 'stabilitySlider',
    similarityBoostSlider: 'similarityBoostSlider',
    styleSlider: 'styleSlider',
    speedValueDisplay: 'speedValueDisplay',
    stabilityValueDisplay: 'stabilityValueDisplay',
    similarityBoostValueDisplay: 'similarityBoostValueDisplay',
    styleValueDisplay: 'styleValueDisplay'
};

const elements = Object.keys(elementIds).reduce((acc, key) => {
    acc[key] = document.getElementById(elementIds[key]);
    return acc;
}, {});

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

    // Load slider values and update their displays in case the script is loaded in the wrong order

    loadSliderValuesAndUpdateDisplay(elements.speedSlider, elements.speedValueDisplay, STORAGE_KEYS.speed, DEFAULT_VALUES.speed);
    loadSliderValuesAndUpdateDisplay(elements.stabilitySlider, elements.stabilityValueDisplay, STORAGE_KEYS.stability, DEFAULT_VALUES.stability);
    loadSliderValuesAndUpdateDisplay(elements.similarityBoostSlider, elements.similarityBoostValueDisplay, STORAGE_KEYS.similarityBoost, DEFAULT_VALUES.similarityBoost);
    loadSliderValuesAndUpdateDisplay(elements.styleSlider, elements.styleValueDisplay, STORAGE_KEYS.style, DEFAULT_VALUES.style);

    //ake sliders visible after local Storage values are set
    const slidersContainer = document.getElementById('voiceSettingsSliders'); //html id of all sliders
    if (slidersContainer) {
        slidersContainer.classList.remove('sliders-loading'); //remove css class hiding sliders
    }
}

function loadSliderValuesAndUpdateDisplay(slider, sliderDisplay, storageKey, sliderDefaultValue) {
    if (slider && sliderDisplay) { //in case the script is loaded in the wrong order
        slider.value = localStorage.getItem(storageKey) || sliderDefaultValue; //load the stored value from localStorage using the storage key, if that fails use the default value
        sliderDisplay.textContent = slider.value;
        changeThumbRangeAppearanceOnDefault(slider, sliderDefaultValue);
    }
}

function setupSlidersWithEvents(slider, sliderValueDisplay, sliderDefaultValue, storageKey) { // update Slider values as well as the text display values of those Sliders
    if (slider && sliderValueDisplay) {
        slider.addEventListener('input', () => {
            sliderValueDisplay.textContent = slider.value; // Update the display value
            localStorage.setItem(storageKey, slider.value); // Save speed to localStorage, every time the slider is moved
            changeThumbRangeAppearanceOnDefault(slider, sliderDefaultValue);
        });
    }
}

function changeThumbRangeAppearanceOnDefault(slider, sliderDefaultValue) {
    if (slider.value == sliderDefaultValue) {
        slider.classList.add('at-default-value'); //modifies css property changing the color
    } else {
        slider.classList.remove('at-default-value');
    }
}

function setupEventListeners() {
    elements.saveApiKey.addEventListener('click', saveApiKey);
    elements.removeApiKey.addEventListener('click', removeApiKey);
    elements.resetParams.addEventListener('click', resetParameters); //works calls correctyl 
    elements.generateVoice.addEventListener('click', generateVoice);
    elements.downloadAudio.addEventListener('click', downloadAudio);
    elements.downloadAudioTelephone.addEventListener('click', downloadAudioTelephone);

    elements.modelId.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.modelId, elements.modelId.value));
    elements.voiceId.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.voiceId, elements.voiceId.value));
    elements.previousText.addEventListener('change', () => localStorage.setItem(STORAGE_KEYS.previousText, elements.previousText.value));

    //update slider values
    setupSlidersWithEvents(elements.speedSlider, elements.speedValueDisplay, DEFAULT_VALUES.speed, STORAGE_KEYS.speed);
    setupSlidersWithEvents(elements.stabilitySlider, elements.stabilityValueDisplay, DEFAULT_VALUES.stability, STORAGE_KEYS.stability);
    setupSlidersWithEvents(elements.similarityBoostSlider, elements.similarityBoostValueDisplay, DEFAULT_VALUES.similarityBoost, STORAGE_KEYS.similarityBoost);
    setupSlidersWithEvents(elements.styleSlider, elements.styleValueDisplay, DEFAULT_VALUES.style, STORAGE_KEYS.style);

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
    // Reset text input values
    elements.modelId.value = DEFAULT_VALUES.modelId;
    elements.voiceId.value = DEFAULT_VALUES.voiceId;
    elements.previousText.value = DEFAULT_VALUES.previousText;

    // Reset slider values
    elements.speedSlider.value = DEFAULT_VALUES.speed;
    elements.stabilitySlider.value = DEFAULT_VALUES.stability;
    elements.similarityBoostSlider.value = DEFAULT_VALUES.similarityBoost;
    elements.styleSlider.value = DEFAULT_VALUES.style;

    // Update slider display values
    elements.speedValueDisplay.textContent = DEFAULT_VALUES.speed;
    elements.stabilityValueDisplay.textContent = DEFAULT_VALUES.stability;
    elements.similarityBoostValueDisplay.textContent = DEFAULT_VALUES.similarityBoost;
    elements.styleValueDisplay.textContent = DEFAULT_VALUES.style;

    // Update localStorage for all values
    localStorage.setItem(STORAGE_KEYS.modelId, DEFAULT_VALUES.modelId);
    localStorage.setItem(STORAGE_KEYS.voiceId, DEFAULT_VALUES.voiceId);
    localStorage.setItem(STORAGE_KEYS.previousText, DEFAULT_VALUES.previousText);
    localStorage.setItem(STORAGE_KEYS.speed, DEFAULT_VALUES.speed);
    localStorage.setItem(STORAGE_KEYS.stability, DEFAULT_VALUES.stability);
    localStorage.setItem(STORAGE_KEYS.similarityBoost, DEFAULT_VALUES.similarityBoost);
    localStorage.setItem(STORAGE_KEYS.style, DEFAULT_VALUES.style);
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
        // Setup Variables
        const requestOptions = {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                //model_id: elements.modelId.value,
                //model_id: "eleven_flash_v2_5", //works
                //model_id: "eleven_v3", //does not work at the Moment, need to get access from elevenlabs
               // model_id: "eleven_multilingual_v2", //hardcoded for now 
                model_id: elements.modelId.value,
                previous_text: elements.previousText.value,
                voice_settings: {
                    speed: parseFloat(elements.speedSlider.value),
                    stability: parseFloat(elements.stabilitySlider.value),
                    similarity_boost: parseFloat(elements.similarityBoostSlider.value),
                    style: parseFloat(elements.styleSlider.value)
                }
            })
        };
        const highQualityRequest = `https://api.elevenlabs.io/v1/text-to-speech/${elements.voiceId.value}?output_format=mp3_44100_128`;
        const telephoneQualityRequest = `https://api.elevenlabs.io/v1/text-to-speech/${elements.voiceId.value}?output_format=pcm_8000`;
        let highQualityResponse = null;
        let telephoneQualityResponse = null;

        let includeTelephoneAudio = document.getElementById('includeTelephoneAudio').checked; //checkbox if telephone audio is included
        if (includeTelephoneAudio) {
            // Parallel API calls for high-quality and telephone-quality audio
            [highQualityResponse, telephoneQualityResponse] = await Promise.all([
                fetch(highQualityRequest, requestOptions),
                fetch(telephoneQualityRequest, requestOptions)]);
        } else {
            elements.audioSectionTel.classList.add('d-none'); // Hide telephone audio player when not generating telephone audio
            highQualityResponse = await fetch(highQualityRequest, requestOptions);
        }
        validateApiResponses(includeTelephoneAudio, highQualityResponse, telephoneQualityResponse);
        processAudioResponses(includeTelephoneAudio, highQualityResponse, telephoneQualityResponse);

    } catch (error) {
        alert('Error generating voice: ' + error.message);
    } finally {
        elements.generateVoice.disabled = false;
        elements.generateVoice.textContent = 'Generate Voice';
    }
}

function validateApiResponses(includeTelephoneAudio, highQualityResponse, telephoneQualityResponse) {
    if (!highQualityResponse.ok) {
        throw new Error(`HTTP error! status: ${highQualityResponse.status}`);
    }
    if (includeTelephoneAudio) {
        if (!telephoneQualityResponse.ok) {
            throw new Error(`HTTP error! status: ${telephoneQualityResponse.status}`);
        }
    }
}

async function processAudioResponses(includeTelephoneAudio, highQualityResponse, telephoneQualityResponse) {
    // Process high-quality audio
    const audioBlob = await highQualityResponse.blob();
    currentAudioBlob = audioBlob;
    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);
    elements.audioPlayer.src = audioUrl;
    elements.audioSectionQuality.classList.remove('d-none'); // Make high-quality player visible

    if (includeTelephoneAudio) {
        // Process telephone quality audio
        const tempTelephoneAudioBlob = await telephoneQualityResponse.blob();
        // Convert PCM to MP3 for telephone audio and assign to global variable
        telephoneAudioBlob = await convertPCM(tempTelephoneAudioBlob);
        const telephoneAudioUrl = URL.createObjectURL(telephoneAudioBlob);
        elements.audioPlayerTelephone.src = telephoneAudioUrl;
        elements.audioSectionTel.classList.remove('d-none'); // Make telephone player visible
    }
}

async function convertPCM(audioBlob) {
    try {
        // Since we're already getting PCM at 8kHz, we dont need any conversion or any audio pipeline processing
        const arrayBuffer = await audioBlob.arrayBuffer();
        const pcmData = new Int16Array(arrayBuffer);

        // code: https://github.com/zhuker/lamejs#quick-start
        // Create MP3 encoder for 8kHz and mono audio
        const mp3encoder = new lamejs.Mp3Encoder(
            1,    // mono
            8000, // 8kHz (matches input)
            64    //bitrate
        );

        // Encode directly to MP3
        const mp3Data = mp3encoder.encodeBuffer(pcmData);
        const mp3Final = mp3encoder.flush();

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

function downloadAudioTelephone() {
    if (!telephoneAudioBlob) {
        alert('No telephone audio available to download!');
        return;
    }
    const downloadUrl = URL.createObjectURL(telephoneAudioBlob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'generated-voice_8000Hz.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
}


function loadParametersFromUrl() { //potentially there is a bug here
    //const urlParams = new URLSearchParams(window.location.search);
    const urlParams = new URLSearchParams(window.location.hash.substring(1)); //von .search zu .hash.substring(1) ungewandelt
    const configParam = urlParams.get(PARAM_KEY); //const PARAM_KEY = 'config'

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
    // setupConfig(config.apiKey);
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
        text.value = elements.text.value; //sets the text to the html text on the website
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
    url.hash = `${PARAM_KEY}=${base64Config}`;
    return url.toString();
}