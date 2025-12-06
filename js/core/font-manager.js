/**
 * Font Manager
 * Handles font loading and registration for PDFMake
 */
window.App.Core.FontManager = {
    /**
     * loadFontsForPDF
     * Ensures all necessary fonts are loaded and registered with PDFMake's VFS.
     * In a non-module environment, we rely on the fonts being loaded into window.App.Data.Fonts
     * by their respective script tags.
     */
    registerFonts: function () {
        if (typeof pdfMake === 'undefined') {
            console.warn('pdfMake is not defined. Skipping font registration for PDF.');
            return;
        }

        // Initialize VFS if not present
        if (!pdfMake.vfs) {
            pdfMake.vfs = {};
        }

        const GlobalFonts = window.App.Data.Fonts || {};

        // Helper to check if font data exists
        const ensureFontData = (fontKey, vfsName) => {
            if (GlobalFonts[fontKey]) {
                pdfMake.vfs[vfsName] = GlobalFonts[fontKey];
                return true;
            } else {
                console.error(`Font data for ${fontKey} not found in window.App.Data.Fonts`);
                return false;
            }
        };

        // Register fonts in VFS
        // These keys 'LessonOne', 'OpenHuninn' must match what the font files assign to window.App.Data.Fonts
        ensureFontData('LessonOne', 'LessonOne-Regular.ttf');
        ensureFontData('OpenHuninn', 'jf-openhuninn.ttf');
        ensureFontData('Iansui', 'Iansui-Regular.ttf');
        ensureFontData('ChiayiCity', 'ChiayiCity.ttf');

        // Define font families for PDFMake
        pdfMake.fonts = {
            'Lesson One': {
                normal: 'LessonOne-Regular.ttf',
                bold: 'LessonOne-Regular.ttf',
                italics: 'LessonOne-Regular.ttf',
                bolditalics: 'LessonOne-Regular.ttf'
            },
            'Open Huninn': {
                normal: 'jf-openhuninn.ttf',
                bold: 'jf-openhuninn.ttf',
                italics: 'jf-openhuninn.ttf',
                bolditalics: 'jf-openhuninn.ttf'
            },
            'Iansui': {
                normal: 'Iansui-Regular.ttf',
                bold: 'Iansui-Regular.ttf',
                italics: 'Iansui-Regular.ttf',
                bolditalics: 'Iansui-Regular.ttf'
            },
            'Chiayi City': {
                normal: 'ChiayiCity.ttf',
                bold: 'ChiayiCity.ttf',
                italics: 'ChiayiCity.ttf',
                bolditalics: 'ChiayiCity.ttf'
            },
            'Roboto': {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
            }
        };

        console.log('Fonts registered with PDFMake');
    },

    /**
     * Load fonts for Canvas Preview using FontFace API
     * This might fail on file:// protocol for external files, but since we have base64 data,
     * we can construct `url(data:font/ttf;base64,...)`
     */
    loadPreviewFonts: async function () {
        console.log('Starting loadPreviewFonts');
        const GlobalFonts = window.App.Data.Fonts || {};

        const fontDefinitions = [
            { family: 'Lesson One', data: GlobalFonts['LessonOne'] },
            { family: 'Open Huninn', data: GlobalFonts['OpenHuninn'] },
            { family: 'Iansui', data: GlobalFonts['Iansui'] },
            { family: 'Chiayi City', data: GlobalFonts['ChiayiCity'] }
        ];

        const promises = fontDefinitions.map(async (def) => {
            if (!def.data) {
                console.warn(`Missing base64 data for ${def.family}`);
                return;
            }

            try {
                // Create a FontFace from the base64 data
                const fontFace = new FontFace(def.family, `url(data:font/ttf;base64,${def.data})`);
                const loadedFace = await fontFace.load();
                document.fonts.add(loadedFace);
                console.log(`Loaded font: ${def.family}`);
            } catch (e) {
                console.error(`Failed to load font ${def.family}`, e);
            }
        });

        await Promise.all(promises);
        console.log('All preview fonts loaded');
    },

    getFontFamilyName: function (filename) {
        switch (filename) {
            case 'LessonOne-Regular.ttf': return 'Lesson One';
            case 'jf-openhuninn.ttf': return 'Open Huninn';
            case 'Iansui-Regular.ttf': return 'Iansui';
            case 'ChiayiCity.ttf': return 'Chiayi City';
            default: return 'Lesson One';
        }
    }
};
