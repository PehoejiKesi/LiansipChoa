// Translations for POJ Handwriting Practice Generator
const translations = {
    en: {
        // Header
        title: "POJ Handwriting Practice Generator",
        subtitle: "Generate PDF worksheets for Pe̍h-ōe-jī handwriting practice.",

        // Language Switcher
        language: "EN",

        // Text Settings Section
        textSettings: "Text Settings",
        pageTitle: "Page Title:",
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
        verticalOffset: "Vertical Offset (mm):",

        // Buttons
        generatePDF: "Generate PDF",

        // Preview
        preview: "Preview"
    },

    poj: {
        // Header
        title: "Pe̍h-ōe-jī Chhiú-siá Liān-si̍p Chóa Chè-chō Ki-á",
        subtitle: "Chè-chō Pe̍h-ōe-jī chhiú-siá liān-si̍p chóa PDF tòng-àn ê ke-si.",

        // Language Switcher
        language: "POJ",

        // Text Settings Section
        textSettings: "Beh Siá Siáⁿ",
        pageTitle: "Phiau-tê (Ē-sái bián):",
        pageTitlePlaceholder: "Lē: \"Liān-si̍p siá jī\"",
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
        handwritingSettings: "Keh-sek Siáⁿ Khoán--ê",
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
        verticalOffset: "Téng-ē Sóa Ūi (mm):",

        // Buttons
        generatePDF: "Chò PDF Tòng-àn",

        // Preview
        preview: "Ē Seⁿ Chò Án-ne"
    }
};

// Get current language from localStorage or default to English
let currentLanguage = localStorage.getItem('pojLang') || 'en';

// Function to get translated text
function t(key) {
    return translations[currentLanguage][key] || translations.en[key] || key;
}

// Function to switch language
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('pojLang', lang);
    updateUILanguage();
}

// Function to update all UI text
function updateUILanguage() {
    // Header
    document.querySelector('h1').textContent = t('title');
    document.querySelector('header p').textContent = t('subtitle');

    // Language selector
    // Label removed from header

    // Text Settings
    document.querySelectorAll('.settings-section h3')[0].textContent = t('textSettings');
    document.querySelector('label[for="pageTitle"]').textContent = t('pageTitle');
    document.getElementById('pageTitle').placeholder = t('pageTitlePlaceholder');
    document.querySelector('label[for="inputText"]').textContent = t('textToPractice');
    document.getElementById('inputText').placeholder = t('textPlaceholder');

    // Page Settings
    document.querySelectorAll('.settings-section h3')[1].textContent = t('pageSettings');
    document.querySelector('label[for="paperSize"]').textContent = t('paperSize');
    document.querySelectorAll('#paperSize option')[0].textContent = t('paperSizeA4');
    document.querySelectorAll('#paperSize option')[1].textContent = t('paperSizeA3');
    document.querySelector('label[for="orientation"]').textContent = t('orientation');
    document.querySelectorAll('#orientation option')[0].textContent = t('orientationPortrait');
    document.querySelectorAll('#orientation option')[1].textContent = t('orientationLandscape');

    // Handwriting Settings
    document.querySelectorAll('.settings-section h3')[2].textContent = t('handwritingSettings');
    document.querySelector('label[for="fontSelect"]').textContent = t('font');
    document.querySelectorAll('#fontSelect option')[0].textContent = t('fontIansui');
    document.querySelectorAll('#fontSelect option')[1].textContent = t('fontOpenHuninn');
    document.querySelectorAll('#fontSelect option')[2].textContent = t('fontChiayiCity');
    document.querySelectorAll('#fontSelect option')[3].textContent = t('fontLessonOne');
    document.querySelector('label[for="practiceMode"]').textContent = t('mode');
    document.querySelectorAll('#practiceMode option')[0].textContent = t('modeTracing');
    document.querySelectorAll('#practiceMode option')[1].textContent = t('modeCopying');
    document.querySelector('label[for="followingLines"]').textContent = t('followingLines');
    document.querySelectorAll('#followingLines option')[0].textContent = t('followingLinesFill');
    document.querySelectorAll('#followingLines option')[1].textContent = t('followingLinesBlank');
    document.querySelector('label[for="lineHeight"]').textContent = t('lineHeight');
    document.querySelector('label[for="guideStyle"]').textContent = t('guideStyle');
    document.querySelectorAll('#guideStyle option')[0].textContent = t('guideStyleNormal');
    document.querySelectorAll('#guideStyle option')[1].textContent = t('guideStyleLight');
    document.querySelectorAll('#guideStyle option')[2].textContent = t('guideStyleNone');
    document.querySelector('label[for="textStyle"]').textContent = t('textStyle');
    document.querySelectorAll('#textStyle option')[0].textContent = t('textStyleBlack');
    document.querySelectorAll('#textStyle option')[1].textContent = t('textStyleGrey');
    document.querySelectorAll('#textStyle option')[2].textContent = t('textStyleLight');
    document.querySelector('label[for="verticalOffset"]').textContent = t('verticalOffset');

    // Buttons
    document.getElementById('generateBtn').textContent = t('generatePDF');

    // Preview
    document.querySelector('.preview-section h2').textContent = t('preview');
}
