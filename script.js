// POJ Handwriting Practice Generator - v3.0 (Unified Layout Engine)

// --- Constants & Config ---
const MM_TO_PT = 2.83465;
const PT_TO_MM = 1 / MM_TO_PT;
const DEFAULT_GAP_MM = 0.5; // Gap between lines

// --- Font Management ---
// Register custom fonts with pdfmake
function registerFonts() {
    pdfMake.vfs = {
        "Iansui-Regular.ttf": typeof IANSUI_FONT_BASE64 !== 'undefined' ? IANSUI_FONT_BASE64 : "",
        "jf-openhuninn.ttf": typeof OPENHUNINN_FONT_BASE64 !== 'undefined' ? OPENHUNINN_FONT_BASE64 : "",
        "ChiayiCity.ttf": typeof CHIAYICITY_FONT_BASE64 !== 'undefined' ? CHIAYICITY_FONT_BASE64 : "",
        "LessonOne-Regular.ttf": typeof LESSONONE_FONT_BASE64 !== 'undefined' ? LESSONONE_FONT_BASE64 : ""
    };

    pdfMake.fonts = {
        Iansui: {
            normal: "Iansui-Regular.ttf",
            bold: "Iansui-Regular.ttf",
            italics: "Iansui-Regular.ttf",
            bolditalics: "Iansui-Regular.ttf"
        },
        OpenHuninn: {
            normal: "jf-openhuninn.ttf",
            bold: "jf-openhuninn.ttf",
            italics: "jf-openhuninn.ttf",
            bolditalics: "jf-openhuninn.ttf"
        },
        ChiayiCity: {
            normal: "ChiayiCity.ttf",
            bold: "ChiayiCity.ttf",
            italics: "ChiayiCity.ttf",
            bolditalics: "ChiayiCity.ttf"
        },
        LessonOne: {
            normal: "LessonOne-Regular.ttf",
            bold: "LessonOne-Regular.ttf",
            italics: "LessonOne-Regular.ttf",
            bolditalics: "LessonOne-Regular.ttf"
        }
    };
}

const fontCache = {};

async function loadPreviewFonts() {
    const fonts = [
        { name: 'Iansui', data: typeof IANSUI_FONT_BASE64 !== 'undefined' ? IANSUI_FONT_BASE64 : null },
        { name: 'OpenHuninn', data: typeof OPENHUNINN_FONT_BASE64 !== 'undefined' ? OPENHUNINN_FONT_BASE64 : null },
        { name: 'ChiayiCity', data: typeof CHIAYICITY_FONT_BASE64 !== 'undefined' ? CHIAYICITY_FONT_BASE64 : null },
        { name: 'LessonOne', data: typeof LESSONONE_FONT_BASE64 !== 'undefined' ? LESSONONE_FONT_BASE64 : null }
    ];

    const promises = fonts.map(async (font) => {
        if (font.data && !fontCache[font.name]) {
            try {
                const binaryString = window.atob(font.data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const fontFace = new FontFace(font.name, bytes.buffer);
                await fontFace.load();
                document.fonts.add(fontFace);
                fontCache[font.name] = true;
                console.log(`${font.name} loaded for preview`);
            } catch (e) {
                console.error(`Failed to load font ${font.name} for preview:`, e);
            }
        }
    });

    await Promise.all(promises);
}

// --- Layout Engine ---

class LayoutEngine {
    constructor(ctx) {
        this.ctx = ctx; // Canvas context for measuring text
    }

    generateLayout(settings) {
        const {
            text,
            paperSize,
            orientation,
            lineHeightMm,
            fontFamily,
            pageTitle,
            practiceMode, // 'tracing' or 'copying'
            followingLines // 'fill' or 'blank'
        } = settings;

        // 1. Setup Dimensions (ALL IN MM)
        const paperDimsMm = this.getPaperDimensionsMm(paperSize, orientation);
        const widthMm = paperDimsMm.width;
        const heightMm = paperDimsMm.height;
        const marginMm = 12;

        // Footer Settings (in MM)
        const footerFontSizeMm = 16 * PT_TO_MM;
        const footerYMm = heightMm - marginMm - footerFontSizeMm;
        const footerTopMarginMm = 5;
        const maxContentYMm = footerYMm - footerTopMarginMm;
        const contentWidthMm = widthMm - (marginMm * 2);

        // Grid Settings (in MM)
        const gridHeightMm = lineHeightMm;
        const gapMm = DEFAULT_GAP_MM;
        const rowHeightMm = gridHeightMm + gapMm;

        // Font Settings (in MM)
        // With 4-line system, text should fit between line 1 (0) and line 3 (0.5)
        // That's 50% of the grid height
        const fontSizeMm = gridHeightMm * 0.5;

        // For text measurement, we need to use pt/px, so convert temporarily
        const fontSizePt = fontSizeMm * MM_TO_PT;
        this.ctx.font = `${fontSizePt}px "${fontFamily}"`;

        // Text padding (left and right) in MM
        const textPaddingMm = 2;

        const pages = [];
        let currentPage = { items: [], pageNumber: 1 };

        // Helper to add title and get start Y (in MM)
        const addTitleAndGetY = (page) => {
            if (pageTitle && pageTitle.trim()) {
                let titleFontSizeMm = 32 * PT_TO_MM;
                let titleFontSizePt = titleFontSizeMm * MM_TO_PT;
                this.ctx.font = `bold ${titleFontSizePt}px "${fontFamily}"`;
                let titleWidthPx = this.ctx.measureText(pageTitle).width;
                // Convert px to mm: px is roughly pt at scale 1, so px * PT_TO_MM
                let titleWidthMm = titleWidthPx * PT_TO_MM;

                // Auto-shrink if title exceeds available width
                const availableWidthMm = contentWidthMm;
                if (titleWidthMm > availableWidthMm) {
                    // Calculate scale factor needed
                    const scaleFactor = availableWidthMm / titleWidthMm;
                    titleFontSizeMm = titleFontSizeMm * scaleFactor;
                    titleFontSizePt = titleFontSizeMm * MM_TO_PT;

                    // Re-measure with new font size
                    this.ctx.font = `bold ${titleFontSizePt}px "${fontFamily}"`;
                    titleWidthPx = this.ctx.measureText(pageTitle).width;
                    titleWidthMm = titleWidthPx * PT_TO_MM;
                }

                const titleYMm = marginMm;
                page.items.push({
                    type: 'title',
                    text: pageTitle,
                    xMm: widthMm / 2, // Center X position
                    yMm: titleYMm,
                    widthMm: titleWidthMm,
                    fontSizeMm: titleFontSizeMm,
                    font: fontFamily
                });

                // Reset font for body
                this.ctx.font = `${fontSizePt}px "${fontFamily}"`;

                // Gap between title and text
                const titleBottomMarginMm = 10;
                return titleYMm + titleFontSizeMm + titleBottomMarginMm;
            }
            return marginMm;
        };

        let currentYMm = addTitleAndGetY(currentPage);

        // Helper to add new page
        const startNewPage = () => {
            pages.push(currentPage);
            currentPage = { items: [], pageNumber: pages.length + 1 };
            currentYMm = addTitleAndGetY(currentPage);
        };

        // 3. Process Text
        const paragraphs = this.normalizeText(text).split('\n');

        paragraphs.forEach(paragraph => {
            if (!paragraph.trim()) {
                // Handle empty line
                if (currentYMm + gridHeightMm > maxContentYMm) {
                    startNewPage();
                }
                this.addLineToPage(currentPage, '', currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                currentYMm += rowHeightMm;
                return;
            }

            const words = paragraph.split(' ');
            let currentLineWords = [];

            // Available width for text (accounting for padding on both sides) in MM
            const availableTextWidthMm = contentWidthMm - (textPaddingMm * 2);
            // Convert mm to px for canvas measurement: mm -> pt -> px (at font size scale)
            const availableTextWidthPx = availableTextWidthMm * MM_TO_PT;

            words.forEach(word => {
                const testLine = currentLineWords.length > 0 ? currentLineWords.join(' ') + ' ' + word : word;
                const metrics = this.ctx.measureText(testLine);

                if (metrics.width > availableTextWidthPx && currentLineWords.length > 0) {
                    // Line full, push currentLine

                    // Check pagination
                    if (currentYMm + gridHeightMm > maxContentYMm) {
                        startNewPage();
                    }

                    this.addLineToPage(currentPage, currentLineWords.join(' '), currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                    currentYMm += rowHeightMm;

                    // If Copying mode, add empty line
                    if (practiceMode === 'copying') {
                        if (currentYMm + gridHeightMm > maxContentYMm) {
                            startNewPage();
                        }
                        this.addLineToPage(currentPage, '', currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                        currentYMm += rowHeightMm;
                        if (currentYMm + gridHeightMm > maxContentYMm) {
                            startNewPage();
                        }
                    }

                    currentLineWords = [word];
                } else {
                    currentLineWords.push(word);
                }
            });

            // Push remaining words
            if (currentLineWords.length > 0) {
                if (currentYMm + gridHeightMm > maxContentYMm) {
                    startNewPage();
                }
                this.addLineToPage(currentPage, currentLineWords.join(' '), currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                currentYMm += rowHeightMm;

                if (practiceMode === 'copying') {
                    if (currentYMm + gridHeightMm > maxContentYMm) {
                        startNewPage();
                    }
                    this.addLineToPage(currentPage, '', currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                    currentYMm += rowHeightMm;
                }
            }
        });

        // 4. Fill remaining lines on current page only
        if (currentPage.items.length === 0 || (followingLines === 'fill' && currentPage.items.length > 0)) {
            let safety = 0;
            while (currentYMm + gridHeightMm <= maxContentYMm && safety < 100) {
                this.addLineToPage(currentPage, '', currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                currentYMm += rowHeightMm;
                safety++;
            }
        }

        // Only push the current page if it has content
        if (currentPage.items.length > 0) {
            pages.push(currentPage);
        }

        // 5. Add Footer to all pages (in MM)
        pages.forEach(page => {
            page.items.push({
                type: 'footer',
                text: 'kesi.poj.tw © Tâi-bûn Ke-si Mī',
                xMm: widthMm / 2,
                yMm: footerYMm,
                fontSizeMm: footerFontSizeMm,
                font: 'Iansui'
            });
        });

        return {
            pages,
            widthMm,
            heightMm
        };
    }

    addLineToPage(page, text, yMm, xMm, widthMm, heightMm, fontSizeMm, font, settings, textPaddingMm = 0) {
        // 4-Line Guide System Layout:
        // Line 1 (top):    y + 0
        // Line 2:          y + height * 0.25
        // Line 3:          y + height * 0.5
        // Line 4:          y + height * 0.75

        // Add Guide Lines (all in MM)
        page.items.push({
            type: 'guide',
            xMm: xMm,
            yMm: yMm,
            widthMm: widthMm,
            heightMm: heightMm,
            style: settings.guideStyle
        });

        // Add Text
        if (text) {
            // Text positioning strategy:
            // - Text should sit between Line 1 (0) and Line 3 (0.5)
            // - Baseline should be at Line 3 (0.5)
            // - Font size is 50% of grid height (distance from Line 1 to Line 3)

            // Calculate baseline Y position (at Line 3) in MM
            const baselineYMm = yMm + (heightMm * 0.5);

            page.items.push({
                type: 'text',
                text: text,
                xMm: xMm + textPaddingMm,
                yMm: baselineYMm,
                fontSizeMm: fontSizeMm,
                font: font,
                color: settings.textStyle,
                align: 'left'
            });
        }
    }

    getPaperDimensionsMm(size, orientation) {
        let width, height;
        if (size === 'a3') { width = 297; height = 420; }
        else { width = 210; height = 297; } // A4

        if (orientation === 'landscape') {
            return { width: height, height: width };
        }
        return { width, height };
    }

    normalizeText(text) {
        return text.normalize('NFC');
    }
}

// --- Renderers ---

function renderPreview(layout, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Scale for high DPI
    const scale = 2;
    const MM_TO_PX = MM_TO_PT * scale; // mm -> pt -> px

    // Calculate total canvas height
    const pageGap = 20 * scale;
    const pageHeightPx = layout.heightMm * MM_TO_PX;
    const totalHeightPx = pageHeightPx * layout.pages.length + (layout.pages.length - 1) * pageGap;

    canvas.width = layout.widthMm * MM_TO_PX;
    canvas.height = totalHeightPx;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    // Clear
    ctx.fillStyle = '#eee'; // Background for the workspace
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let pageY = 0;

    layout.pages.forEach(page => {
        // Draw Page Background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, pageY, layout.widthMm * MM_TO_PX, pageHeightPx);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(0, pageY, layout.widthMm * MM_TO_PX, pageHeightPx);

        // Draw Items
        page.items.forEach(item => {
            if (item.type === 'guide') {
                drawGuideOnCanvas(ctx, item, MM_TO_PX, pageY);
            } else if (item.type === 'text') {
                drawTextOnCanvas(ctx, item, MM_TO_PX, pageY);
            } else if (item.type === 'title') {
                drawTitleOnCanvas(ctx, item, MM_TO_PX, pageY);
            } else if (item.type === 'footer') {
                drawFooterOnCanvas(ctx, item, MM_TO_PX, pageY);
            }
        });

        pageY += pageHeightPx + pageGap;
    });
}

function drawGuideOnCanvas(ctx, item, mmToPx, pageOffsetY) {
    if (item.style === 'none') return;

    const x = item.xMm * mmToPx;
    const y = item.yMm * mmToPx + pageOffsetY;
    const w = item.widthMm * mmToPx;
    const h = item.heightMm * mmToPx;

    const color = item.style === 'light' ? '#dcdcdc' : '#999';

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Top line at 0 (solid)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();

    // Second line at 0.25 (dashed)
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, y + (h * 0.25));
    ctx.lineTo(x + w, y + (h * 0.25));
    ctx.stroke();
    ctx.setLineDash([]);

    // Third line at 0.5 (solid)
    ctx.beginPath();
    ctx.moveTo(x, y + (h * 0.5));
    ctx.lineTo(x + w, y + (h * 0.5));
    ctx.stroke();

    // Fourth line at 0.75 (dashed)
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, y + (h * 0.75));
    ctx.lineTo(x + w, y + (h * 0.75));
    ctx.stroke();
    ctx.setLineDash([]);

    // Left vertical line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h * 0.75);
    ctx.stroke();

    // Right vertical line
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w, y + h * 0.75);
    ctx.stroke();
}

function drawTextOnCanvas(ctx, item, mmToPx, pageOffsetY) {
    const x = item.xMm * mmToPx;
    const y = item.yMm * mmToPx + pageOffsetY; // This is baseline y

    let color = 'black';
    if (item.color === 'grey') color = '#999';
    else if (item.color === 'light') color = '#dcdcdc';

    ctx.font = `${item.fontSizeMm * mmToPx}px "${item.font}"`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'alphabetic'; // Important: baseline at y position
    ctx.fillText(item.text, x, y);
}

function drawTitleOnCanvas(ctx, item, mmToPx, pageOffsetY) {
    const x = item.xMm * mmToPx;
    const y = item.yMm * mmToPx + pageOffsetY;

    ctx.font = `bold ${item.fontSizeMm * mmToPx}px "${item.font}"`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(item.text, x, y);
    ctx.textAlign = 'left'; // Reset
}

function drawFooterOnCanvas(ctx, item, mmToPx, pageOffsetY) {
    const x = item.xMm * mmToPx;
    const y = item.yMm * mmToPx + pageOffsetY;

    ctx.font = `${item.fontSizeMm * mmToPx}px "${item.font}"`;
    ctx.fillStyle = '#999';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(item.text, x, y);
    ctx.textAlign = 'left'; // Reset
}

function generatePDF(layout) {
    const docContent = [];

    // Convert layout dimensions from mm to pt
    const widthPt = layout.widthMm * MM_TO_PT;
    const heightPt = layout.heightMm * MM_TO_PT;

    layout.pages.forEach((page, index) => {
        // Page Break for subsequent pages
        if (index > 0) {
            docContent.push({ text: '', pageBreak: 'before' });
        }

        page.items.forEach(item => {
            if (item.type === 'guide') {
                if (item.style === 'none') return;
                const color = item.style === 'light' ? '#dcdcdc' : '#999';

                // Convert mm to pt
                const xPt = item.xMm * MM_TO_PT;
                const yPt = item.yMm * MM_TO_PT;
                const widthPt = item.widthMm * MM_TO_PT;
                const heightPt = item.heightMm * MM_TO_PT;

                // Draw 4 horizontal lines + 2 vertical lines
                docContent.push({
                    canvas: [
                        { type: 'line', x1: 0, y1: 0, x2: widthPt, y2: 0, lineWidth: 0.5, lineColor: color }, // Top (solid)
                        { type: 'line', x1: 0, y1: heightPt * 0.25, x2: widthPt, y2: heightPt * 0.25, lineWidth: 0.5, lineColor: color, dash: { length: 2 } }, // 0.25 (dashed)
                        { type: 'line', x1: 0, y1: heightPt * 0.5, x2: widthPt, y2: heightPt * 0.5, lineWidth: 0.5, lineColor: color }, // 0.5 (solid)
                        { type: 'line', x1: 0, y1: heightPt * 0.75, x2: widthPt, y2: heightPt * 0.75, lineWidth: 0.5, lineColor: color, dash: { length: 2 } }, // 0.75 (dashed)
                        { type: 'line', x1: 0, y1: 0, x2: 0, y2: heightPt * 0.75, lineWidth: 0.5, lineColor: color }, // Left vertical
                        { type: 'line', x1: widthPt, y1: 0, x2: widthPt, y2: heightPt * 0.75, lineWidth: 0.5, lineColor: color } // Right vertical
                    ],
                    absolutePosition: { x: xPt, y: yPt }
                });
            } else if (item.type === 'text') {
                let color = 'black';
                if (item.color === 'grey') color = '#999';
                else if (item.color === 'light') color = '#dcdcdc';

                // Convert mm to pt
                const xPt = item.xMm * MM_TO_PT;
                const baselineYPt = item.yMm * MM_TO_PT;
                const fontSizePt = item.fontSizeMm * MM_TO_PT;

                // pdfmake positions text from top-left, but we have baseline Y
                // Each font renders differently in pdfmake vs canvas, so we need font-specific corrections
                const fontCorrectionFactors = {
                    'LessonOne': 1.27,
                    'OpenHuninn': 1.00,
                    'Iansui': 1.12,
                    'ChiayiCity': 1.36,
                };

                const correctionFactor = fontCorrectionFactors[item.font] || 0.95;
                // Estimate ascent based on font size
                const estimatedAscent = fontSizePt * 0.85;
                const correctedAscent = estimatedAscent * correctionFactor;
                const topY = baselineYPt - correctedAscent;

                docContent.push({
                    text: item.text,
                    font: item.font,
                    fontSize: fontSizePt,
                    color: color,
                    absolutePosition: { x: xPt, y: topY }
                });
            } else if (item.type === 'title') {
                // Convert mm to pt
                const yPt = item.yMm * MM_TO_PT;
                const fontSizePt = item.fontSizeMm * MM_TO_PT;

                docContent.push({
                    text: item.text,
                    font: item.font,
                    fontSize: fontSizePt,
                    bold: true,
                    alignment: 'center',
                    absolutePosition: { x: 0, y: yPt },
                    width: widthPt // Full page width for centering
                });
            } else if (item.type === 'footer') {
                // Convert mm to pt
                const yPt = item.yMm * MM_TO_PT;
                const fontSizePt = item.fontSizeMm * MM_TO_PT;

                docContent.push({
                    text: item.text,
                    font: item.font,
                    fontSize: fontSizePt,
                    color: '#999',
                    alignment: 'center',
                    absolutePosition: { x: 0, y: yPt },
                    width: widthPt // Ensure centering works
                });
            }
        });
    });

    const docDefinition = {
        pageSize: { width: widthPt, height: heightPt },
        pageMargins: [0, 0, 0, 0], // We handle margins
        content: docContent,
        defaultStyle: {
            font: 'Iansui' // Default
        }
    };

    pdfMake.createPdf(docDefinition).download('POJ_Liansip_Choa.pdf');
}

// --- Main Integration ---

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const ui = {
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

    // Initialize Language
    if (typeof currentLanguage !== 'undefined') {
        ui.languageSelect.value = currentLanguage;
        updateUILanguage();
    }
    ui.languageSelect.addEventListener('change', (e) => {
        switchLanguage(e.target.value);
        // Update preset title when language changes
        const currentPreset = ui.presetSelect.value;
        if (currentPreset !== 'custom' && PRESETS[currentPreset]) {
            const lang = e.target.value;
            ui.pageTitle.value = PRESETS[currentPreset].title[lang] || PRESETS[currentPreset].title.poj;
        }
    });

    // Clear Buttons
    if (ui.clearTitleBtn) ui.clearTitleBtn.addEventListener('click', () => { ui.pageTitle.value = ''; update(); });
    if (ui.clearTextBtn) ui.clearTextBtn.addEventListener('click', () => { ui.inputText.value = ''; update(); });

    // Update Logic
    const update = () => {
        const settings = {
            text: ui.inputText.value,
            paperSize: ui.paperSize.value,
            orientation: ui.orientation.value,
            lineHeightMm: parseInt(ui.lineHeight.value) || 14,
            fontFamily: getFontFamilyName(ui.fontSelect.value),
            pageTitle: ui.pageTitle.value,
            practiceMode: ui.practiceMode.value,
            followingLines: ui.followingLines.value,
            guideStyle: ui.guideStyle.value,
            textStyle: ui.textStyle.value,

        };

        // Create a dummy canvas for measurement
        const measureCanvas = document.createElement('canvas');
        const ctx = measureCanvas.getContext('2d');
        const engine = new LayoutEngine(ctx);

        const layout = engine.generateLayout(settings);
        renderPreview(layout, 'previewCanvas');

        // Store layout for PDF generation
        window.currentLayout = layout;
    };

    // Event Listeners
    const inputs = [
        ui.inputText, ui.paperSize, ui.lineHeight, ui.fontSelect,
        ui.pageTitle, ui.orientation, ui.practiceMode, ui.followingLines,
        ui.guideStyle, ui.textStyle
    ];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', update);
    });

    // Preset Selection Handler
    ui.presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val !== 'custom' && PRESETS[val]) {
            const preset = PRESETS[val];
            ui.inputText.value = preset.text;
            // Set title based on current language
            const lang = currentLanguage || 'poj';
            ui.pageTitle.value = preset.title[lang] || preset.title.poj;
            update();
        }
    });

    // Detect custom input
    ui.inputText.addEventListener('input', () => {
        const currentText = ui.inputText.value;
        let match = false;
        for (const [key, preset] of Object.entries(PRESETS)) {
            if (currentText === preset.text) {
                ui.presetSelect.value = key;
                match = true;
                break;
            }
        }
        if (!match) {
            ui.presetSelect.value = 'custom';
        }
    });
    ui.generateBtn.addEventListener('click', () => {
        if (window.currentLayout) {
            ui.generateBtn.textContent = 'Generating...';
            ui.generateBtn.disabled = true;
            try {
                registerFonts();
                generatePDF(window.currentLayout);
            } catch (e) {
                console.error(e);
                alert('Error generating PDF');
            } finally {
                ui.generateBtn.textContent = 'Generate PDF';
                ui.generateBtn.disabled = false;
            }
        }
    });

    // Initial Load
    loadPreviewFonts().then(() => {
        // Load default preset on initial page load
        const initialPreset = ui.presetSelect.value;
        if (initialPreset !== 'custom' && PRESETS[initialPreset]) {
            const preset = PRESETS[initialPreset];
            ui.inputText.value = preset.text;
            const lang = currentLanguage || 'poj';
            ui.pageTitle.value = preset.title[lang] || preset.title.poj;
        }
        update();
    });
});

// Helper: Map filename to font family
function getFontFamilyName(filename) {
    if (filename === 'Iansui-Regular.ttf') return 'Iansui';
    if (filename === 'jf-openhuninn.ttf') return 'OpenHuninn';
    if (filename === 'ChiayiCity.ttf') return 'ChiayiCity';
    if (filename === 'LessonOne-Regular.ttf') return 'LessonOne';
    return 'Iansui';
}
