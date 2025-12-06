/**
 * Main Application Entry Point
 * Initializes the application and handles UI interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Main.js: DOMContentLoaded fired');

    // Shortcuts to Core and Data modules
    const FontManager = window.App.Core.FontManager;
    const LayoutEngine = window.App.Core.LayoutEngine;
    const PreviewRenderer = window.App.Core.PreviewRenderer;
    const pdfGenerator = window.App.Core.pdfGenerator;
    const Constants = window.App.Core.Constants;

    // Data shortcuts (using global objects directly as they are data containers)
    // window.App.Data.Presets is accessed directly
    // window.App.Data.Translations is accessed directly

    // Initialize functionality
    initApp();

    function initApp() {
        console.log('Initializing App...');

        // Register fonts with PDFMake
        if (FontManager && FontManager.registerFonts) {
            FontManager.registerFonts();
        }

        // Initialize UI Elements
        const ui = getUIElements();

        // Initialize Language
        initLanguage(ui);

        // Initialize Preset Selection
        initPresets(ui);

        // Initialize Event Listeners
        initEventListeners(ui);

        // Load Preview Fonts and Initial Render
        if (FontManager && FontManager.loadPreviewFonts) {
            FontManager.loadPreviewFonts().then(() => {
                console.log('Preview fonts loaded, updating preview...');
                updatePreview(ui);
            });
        } else {
            updatePreview(ui);
        }

        // Expose update function globally if needed for other scripts
        window.App.updatePreview = () => updatePreview(ui);
    }

    function getUIElements() {
        return {
            generateBtn: document.getElementById('generateBtn'),
            inputText: document.getElementById('inputText'),
            paperSize: document.getElementById('paperSize'),
            lineHeight: document.getElementById('lineHeight'),
            fontSelect: document.getElementById('fontSelect'),
            pageTitle: document.getElementById('pageTitle'),
            orientation: document.getElementById('orientation'),
            practiceMode: document.getElementById('practiceMode'),
            followingLines: document.getElementById('followingLines'),
            guideStyle: document.getElementById('guideStyle'),
            textStyle: document.getElementById('textStyle'),
            languageSelect: document.getElementById('languageSelect'),
            presetSelect: document.getElementById('presetSelect'),
            clearTitleBtn: document.getElementById('clearTitleBtn'),
            clearTextBtn: document.getElementById('clearTextBtn')
        };
    }

    function initLanguage(ui) {
        // Translation helper
        const t = window.App.Data.t;
        const currentLanguage = window.App.Data.currentLanguage;
        const updateUILanguage = window.App.Data.updateUILanguage;

        if (ui.languageSelect && currentLanguage) {
            ui.languageSelect.value = currentLanguage;
        }

        if (updateUILanguage) {
            updateUILanguage();
        }

        if (ui.languageSelect) {
            ui.languageSelect.addEventListener('change', (e) => {
                if (window.App.Data.switchLanguage) {
                    window.App.Data.switchLanguage(e.target.value);
                }

                // Update preset title if a preset is selected
                const Presets = window.App.Data.Presets;
                const currentPreset = ui.presetSelect.value;
                if (currentPreset !== 'custom' && Presets && Presets[currentPreset]) {
                    const lang = e.target.value;
                    ui.pageTitle.value = Presets[currentPreset].title[lang] || Presets[currentPreset].title.poj;
                }

                // Re-render premade section with new language
                if (window.App.UI && window.App.UI.Premade && window.App.UI.Premade.init) {
                    window.App.UI.Premade.init();
                }

                updatePreview(ui);
            });
        }
    }

    function initPresets(ui) {
        const Presets = window.App.Data.Presets;
        if (!ui.presetSelect || !Presets) return;

        // Clear existing options except 'custom'
        // Assuming HTML has 'custom' as first option or we rebuild it.
        // Let's rebuild options from Presets object

        ui.presetSelect.innerHTML = '';
        // Add an empty placeholder if needed, or just start with the first preset

        // Map preset keys to translation keys
        const presetTranslationKeys = {
            'empty': 'presetEmpty',
            'default': 'presetDefault',
            'vowels': 'presetVowels',
            'consonants': 'presetConsonants',
            'tones': 'presetTones'
        };

        const t = window.App.Data.t;

        for (const [key, preset] of Object.entries(Presets)) {
            const option = document.createElement('option');
            option.value = key;
            // Use translation key if available, otherwise fall back to preset title
            const translationKey = presetTranslationKeys[key];
            option.textContent = translationKey ? t(translationKey) : (preset.title[window.App.Data.currentLanguage] || preset.title.poj);
            option.setAttribute('data-i18n', translationKey || '');
            ui.presetSelect.appendChild(option);
        }

        // Set default selection
        ui.presetSelect.value = 'default';

        const applyPreset = (key) => {
            const preset = Presets[key];
            if (preset) {
                if (ui.fontSelect && preset.font) ui.fontSelect.value = preset.font;
                if (ui.lineHeight && preset.lineHeight) ui.lineHeight.value = preset.lineHeight;
                if (ui.guideStyle && preset.guideStyle) ui.guideStyle.value = preset.guideStyle;
                if (ui.textStyle && preset.textStyle) ui.textStyle.value = preset.textStyle;
                if (ui.practiceMode && preset.practiceMode) ui.practiceMode.value = preset.practiceMode;
                if (ui.followingLines && preset.followingLines) ui.followingLines.value = preset.followingLines;

                const lang = window.App.Data.currentLanguage || 'poj';
                if (ui.pageTitle) ui.pageTitle.value = preset.title[lang] || preset.title.poj;
                if (ui.inputText) ui.inputText.value = preset.text;

                updatePreview(ui);
            }
        };

        ui.presetSelect.addEventListener('change', (e) => {
            applyPreset(e.target.value);
        });

        // Apply default preset on load if selected
        if (ui.presetSelect.value) {
            applyPreset(ui.presetSelect.value);
        }
    }

    function initEventListeners(ui) {
        // Generate PDF
        if (ui.generateBtn) {
            ui.generateBtn.addEventListener('click', () => {
                const settings = getSettingsFromUI(ui);
                const ctx = getMeasureContext();
                const engine = new LayoutEngine(ctx);
                const layout = engine.generateLayout(settings);

                if (pdfGenerator) {
                    pdfGenerator(layout, settings.pageTitle);
                } else {
                    console.error('PDF Generator not found');
                }
            });
        }

        // Live Preview updates on input change
        const inputs = [
            ui.inputText, ui.paperSize, ui.lineHeight, ui.fontSelect,
            ui.pageTitle, ui.orientation, ui.practiceMode, ui.followingLines,
            ui.guideStyle, ui.textStyle
        ];

        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => updatePreview(ui));
                input.addEventListener('change', () => updatePreview(ui)); // For select elements
            }
        });

        // Clear Buttons
        if (ui.clearTitleBtn) {
            ui.clearTitleBtn.addEventListener('click', () => {
                ui.pageTitle.value = '';
                updatePreview(ui);
            });
        }
        if (ui.clearTextBtn) {
            ui.clearTextBtn.addEventListener('click', () => {
                ui.inputText.value = '';
                updatePreview(ui);
            });
        }
        // URL to Tab mapping
        const urlToTab = {
            '/liah': 'premade'
        };
        const tabToUrl = {
            'premade': '/liah'
        };

        // Tab Switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        const switchToTab = (tabId, updateUrl = true) => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Find and activate the correct button
            const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
            if (targetBtn) {
                targetBtn.classList.add('active');
            }

            // Show corresponding content
            const content = document.getElementById(`${tabId}-section`);
            if (content) {
                content.classList.add('active');

                // Specific logic for Premade tab
                if (tabId === 'premade') {
                    // Initialize premade section if needed
                    if (window.App.Data.initPremadeUI) {
                        window.App.Data.initPremadeUI();
                    }
                }
            }

            // Update URL if needed
            if (updateUrl && tabToUrl[tabId]) {
                history.pushState({ tab: tabId }, '', tabToUrl[tabId]);
            } else if (updateUrl && tabId === 'generator') {
                history.pushState({ tab: tabId }, '', '/');
            }
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                switchToTab(tabId);
            });
        });

        // Handle browser back/forward navigation
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.tab) {
                switchToTab(event.state.tab, false);
            } else {
                // Check current path
                const path = window.location.pathname;
                const tabId = urlToTab[path] || 'generator';
                switchToTab(tabId, false);
            }
        });

        // Check URL on initial load
        const initialPath = window.location.pathname;
        const initialTab = urlToTab[initialPath];
        if (initialTab) {
            switchToTab(initialTab, false);
        }
    }

    function updatePreview(ui) {
        const settings = getSettingsFromUI(ui);
        const ctx = getMeasureContext();

        if (!LayoutEngine) return;

        const engine = new LayoutEngine(ctx);
        const layout = engine.generateLayout(settings);

        // Store current layout for debugging or PDF generation
        window.currentLayout = layout;

        if (PreviewRenderer) {
            PreviewRenderer.renderPreview(layout, 'previewCanvas');
        }
    }

    function getSettingsFromUI(ui) {
        // Font selection now uses Family Names directly from the <select> value
        const selectedFont = ui.fontSelect.value;

        return {
            text: ui.inputText.value,
            paperSize: ui.paperSize.value,
            orientation: ui.orientation.value,
            lineHeightMm: parseInt(ui.lineHeight.value) || 14,
            fontFamily: selectedFont,
            pageTitle: ui.pageTitle.value,
            practiceMode: ui.practiceMode.value,
            followingLines: ui.followingLines.value,
            guideStyle: ui.guideStyle.value,
            textStyle: ui.textStyle.value,
        };
    }


    function getMeasureContext() {
        const measureCanvas = document.createElement('canvas');
        return measureCanvas.getContext('2d');
    }
});
