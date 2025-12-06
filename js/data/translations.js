/**
 * Translation System for POJ Handwriting Practice Generator
 * Supports English (en) and Pe̍h-ōe-jī (poj) languages
 */

(function () {
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

            // Tabs
            tabGenerator: "Generator",
            tabPremade: "Premade",

            // Premade Section
            premadeVowelsTitle: "Vowels",
            premadeVowelsDesc: "a, i, u, o͘, e, o",
            premadeTonesTitle: "Tones",
            premadeTonesDesc: "8 tones",
            premadeConsonantsTitle: "Consonants",
            premadeConsonantsDesc: "p, ph, m, b, etc.",
            premadeButton: "Download PDF",

            // Tags
            tagAll: "All",
            tagVowels: "Vowels",
            tagConsonants: "Consonants",
            tagTones: "Tones",
            tagBeginner: "Beginner",
            tagAlphabet: "Alphabet",

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

            // Tabs
            tabGenerator: "Chè-chō Ki-á",
            tabPremade: "Lia̍h Chò Hó--ê",

            // Premade Section
            premadeVowelsTitle: "Bó-im",
            premadeVowelsDesc: "a, i, u, o͘, e, o",
            premadeTonesTitle: "Siaⁿ-tiāu",
            premadeTonesDesc: "8 siaⁿ-tiāu",
            premadeConsonantsTitle: "Chú-im",
            premadeConsonantsDesc: "p, ph, m, b...",
            premadeButton: "Táng-ló͘ PDF",

            // Tags
            tagAll: "Choân-pō͘",
            tagVowels: "Bó-im",
            tagConsonants: "Chú-im",
            tagTones: "Siaⁿ-tiāu",
            tagBeginner: "Chho͘-ha̍k-chiá",
            tagAlphabet: "Jī-bó",

            // Preview
            preview: "Ē Seⁿ Chò Án-ne"
        }
    };

    // Get current language from localStorage or default to POJ
    let currentLanguage = 'poj';
    try {
        currentLanguage = localStorage.getItem('pojLang') || 'poj';
    } catch (e) {
        console.warn('LocalStorage access failed (likely due to file:// protocol), defaulting to POJ', e);
    }

    /**
     * Gets translated text for a given key
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    function t(key) {
        const lang = currentLanguage;
        return translations[lang][key] || translations.en[key] || key;
    }

    /**
     * Update language across the UI
     * @param {string} lang - Language code ('en' or 'poj')
     */
    function updateUILanguage(lang) {
        if (!lang) lang = currentLanguage;
        if (!translations[lang]) return;

        currentLanguage = lang;
        window.App.Data.currentLanguage = currentLanguage; // Update global state

        try {
            localStorage.setItem('pojLang', lang);
        } catch (e) {
            console.warn('LocalStorage write failed', e);
        }

        document.documentElement.lang = lang;

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = t(key);
            if (translation) {
                // If it's an input/textarea with placeholder, don't change text content
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Do nothing for now, placeholders handled below
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = t(key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Premade Section Header (dynamic update if needed, but data-i18n handles it now)
        // If there are other dynamic elements, handle them here or ensure they have data-i18n attributes.
    }

    /**
     * Switch language and update UI
     * @param {string} lang - Language code
     */
    function switchLanguage(lang) {
        updateUILanguage(lang);
    }

    // Assign to Global Namespace
    window.App.Data.Translations = translations;
    window.App.Data.currentLanguage = currentLanguage;
    window.App.Data.t = t;
    window.App.Data.updateUILanguage = updateUILanguage;
    window.App.Data.switchLanguage = switchLanguage;

})();
