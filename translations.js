/**
 * Translation System for POJ Handwriting Practice Generator
 * Supports English (en) and Pe̍h-ōe-jī (poj) languages
 */

// Translation data for all UI elements
const translations = {
    en: {
        // Header
        title: "POJ Handwriting Practice Generator",
        subtitle: "Generate PDF worksheets for Pe̍h-ōe-jī handwriting practice.",
        language: "EN",

        // Text Settings Section
        textSettings: "Text Settings",
        pageTitle: "Page Title:",
        preset: "Preset:",
        presetEmpty: "Empty",
        presetDefault: "Default",
        presetVowels: "Vowels (A, I, U, O͘, E, O)",
        presetConsonants: "Consonants (P, Ph, M, B...)",
        presetTones: "Tone Marks (A, Á, À, Ah...)",
        pageTitlePlaceholder: "e.g., Handwriting Practice",
        textToPractice: "Text to Practice:",
        textPlaceholder: "Enter text to practice...",

        // Page Settings
        pageSettings: "Page Settings",
        paperSize: "Paper Size:",
        paperSizeA4: "A4 (210 x 297 mm)",
        paperSizeA3: "A3 (297 x 420 mm)",
        orientation: "Orientation:",
        orientationPortrait: "Portrait",
        orientationLandscape: "Landscape",

        // Handwriting Settings
        handwritingSettings: "Handwriting Settings",
        font: "Font:",
        fontIansui: "Iansui",
        fontOpenHuninn: "Open Huninn",
        fontChiayiCity: "Chiayi City",
        fontLessonOne: "Lesson One",
        mode: "Mode:",
        modeTracing: "Tracing (Text on every line)",
        modeCopying: "Copying (Text then blank line)",
        followingLines: "Following Lines:",
        followingLinesFill: "Fill with blanks",
        followingLinesBlank: "Leave blank",
        lineHeight: "Line Height (mm):",
        guideStyle: "Guides Style:",
        guideStyleNormal: "Normal (Grey)",
        guideStyleLight: "Light (Light Grey)",
        guideStyleNone: "None",
        textStyle: "Text Style:",
        textStyleBlack: "Solid Black",
        textStyleGrey: "Grey (for Tracing)",
        textStyleLight: "Light Grey (for Tracing)",

        // Buttons
        generatePDF: "Generate PDF",
        clearButton: "Clear",

        // Preview
        preview: "Preview"
    },

    poj: {
        // Header
        title: "Pe̍h-ōe-jī Chhiú-siá Liān-si̍p Chóa Chè-chō Ki-á",
        subtitle: "Chè-chō Pe̍h-ōe-jī chhiú-siá liān-si̍p chóa PDF tòng-àn ê ke-si.",
        language: "POJ",

        // Text Settings Section
        textSettings: "Beh Siá Siáⁿ",
        pageTitle: "Phiau-tê (Ē-sái bián):",
        preset: "Kiàn-pún:",
        presetEmpty: "Khang--ê",
        presetDefault: "Chiàu-goân",
        presetVowels: "Bó-im (A, I, U, O͘, E, O)",
        presetConsonants: "Chú-im (P, Ph, M, B...)",
        presetTones: "Siaⁿ-tiāu (A, Á, À, Ah...)",
        pageTitlePlaceholder: "Lē: \"Liān-si̍p Siá Pe̍h-ōe-jī\"",
        textToPractice: "Beh Liān-si̍p Siá Siáⁿ:",
        textPlaceholder: "Tī chia phah jī...",

        // Page Settings
        pageSettings: "Beh Gōa Tōa Tiuⁿ",
        paperSize: "Chóa Ê Chhùn-chhioh:",
        paperSizeA4: "A4 (210 x 297 mm)",
        paperSizeA3: "A3 (297 x 420 mm)",
        orientation: "Hong-hiòng:",
        orientationPortrait: "Ti̍t--ê",
        orientationLandscape: "Hoâiⁿ--ê",

        // Handwriting Settings
        handwritingSettings: "Keh-sek Siáⁿ Khoán",
        font: "Jī-thé:",
        fontIansui: "Iansui",
        fontOpenHuninn: "Open Huninn",
        fontChiayiCity: "Chiayi City",
        fontLessonOne: "Lesson One",
        mode: "Án-chóaⁿ Liān:",
        modeTracing: "Tòe sòaⁿ siá (Ta̍k chōa lóng ū jī)",
        modeCopying: "Chhau 1 pái (Kiàn-pún ē-té lâu 1 chōa khang--ê)",
        textStyle: "Bûn-jī Khoán-sek:",
        textStyleBlack: "O͘--ê",
        textStyleGrey: "Chhián o͘--ê (Tòe sòaⁿ siá)",
        textStyleLight: "Phú--ê (Tòe sòaⁿ siá)",
        followingLines: "Chham-khó Sòaⁿ:",
        followingLinesFill: "Kui ia̍h lóng ū",
        followingLinesBlank: "Lâu khang-pe̍h",
        guideStyle: "Chham-khó Sòaⁿ Ê Sek-chúi:",
        guideStyleNormal: "It-poaⁿ (Phú--ê)",
        guideStyleLight: "Khah Chhián (Chhián Phú--ê)",
        guideStyleNone: "Bián Sòaⁿ",
        lineHeight: "1 Chōa Gōa Koân (mm):",

        // Buttons
        generatePDF: "Chò PDF Tòng-àn",
        clearButton: "Thâi",

        // Preview
        preview: "Ē Seⁿ Chò Án-ne"
    }
};

// Get current language from localStorage or default to POJ
let currentLanguage = localStorage.getItem('pojLang') || 'poj';

/**
 * Gets translated text for a given key
 * @param {string} key - Translation key
 * @returns {string} Translated text
 */
function t(key) {
    return translations[currentLanguage][key] || translations.en[key] || key;
}

/**
 * Switches the current language and updates UI
 * @param {string} lang - Language code ('en' or 'poj')
 */
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('pojLang', lang);
    updateUILanguage();
}

/**
 * Updates all UI text elements with current language translations
 * Uses more robust selectors to avoid fragile array indexing
 */
function updateUILanguage() {
    // Helper function to safely update element text
    const updateText = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    };

    const updatePlaceholder = (selector, text) => {
        const element = document.querySelector(selector);
        if (element) element.placeholder = text;
    };

    // Header
    updateText('h1', t('title'));
    updateText('header p', t('subtitle'));

    // Text Settings Section
    updateText('.settings-section:nth-of-type(1) h3', t('textSettings'));
    updateText('label[for="pageTitle"]', t('pageTitle'));
    updateText('label[for="presetSelect"]', t('preset'));
    updateText('#presetSelect option[value="empty"]', t('presetEmpty'));
    updateText('#presetSelect option[value="default"]', t('presetDefault'));
    updateText('#presetSelect option[value="vowels"]', t('presetVowels'));
    updateText('#presetSelect option[value="consonants"]', t('presetConsonants'));
    updateText('#presetSelect option[value="tones"]', t('presetTones'));
    updatePlaceholder('#pageTitle', t('pageTitlePlaceholder'));
    updateText('label[for="inputText"]', t('textToPractice'));
    updatePlaceholder('#inputText', t('textPlaceholder'));

    // Page Settings Section
    updateText('.settings-section:nth-of-type(2) h3', t('pageSettings'));
    updateText('label[for="paperSize"]', t('paperSize'));
    updateText('#paperSize option[value="a4"]', t('paperSizeA4'));
    updateText('#paperSize option[value="a3"]', t('paperSizeA3'));
    updateText('label[for="orientation"]', t('orientation'));
    updateText('#orientation option[value="portrait"]', t('orientationPortrait'));
    updateText('#orientation option[value="landscape"]', t('orientationLandscape'));

    // Handwriting Settings Section
    updateText('.settings-section:nth-of-type(3) h3', t('handwritingSettings'));
    updateText('label[for="fontSelect"]', t('font'));
    updateText('#fontSelect option[value="LessonOne-Regular.ttf"]', t('fontLessonOne'));
    updateText('#fontSelect option[value="jf-openhuninn.ttf"]', t('fontOpenHuninn'));
    updateText('#fontSelect option[value="Iansui-Regular.ttf"]', t('fontIansui'));
    updateText('#fontSelect option[value="ChiayiCity.ttf"]', t('fontChiayiCity'));
    updateText('label[for="practiceMode"]', t('mode'));
    updateText('#practiceMode option[value="tracing"]', t('modeTracing'));
    updateText('#practiceMode option[value="copying"]', t('modeCopying'));
    updateText('label[for="followingLines"]', t('followingLines'));
    updateText('#followingLines option[value="fill"]', t('followingLinesFill'));
    updateText('#followingLines option[value="blank"]', t('followingLinesBlank'));
    updateText('label[for="lineHeight"]', t('lineHeight'));
    updateText('label[for="guideStyle"]', t('guideStyle'));
    updateText('#guideStyle option[value="normal"]', t('guideStyleNormal'));
    updateText('#guideStyle option[value="light"]', t('guideStyleLight'));
    updateText('#guideStyle option[value="none"]', t('guideStyleNone'));
    updateText('label[for="textStyle"]', t('textStyle'));
    updateText('#textStyle option[value="black"]', t('textStyleBlack'));
    updateText('#textStyle option[value="grey"]', t('textStyleGrey'));
    updateText('#textStyle option[value="light"]', t('textStyleLight'));

    // Buttons
    updateText('#generateBtn', t('generatePDF'));
    updateText('#clearTitleBtn', t('clearButton'));
    updateText('#clearTextBtn', t('clearButton'));

    // Preview
    updateText('.preview-section h2', t('preview'));
}
