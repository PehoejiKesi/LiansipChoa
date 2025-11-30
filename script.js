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
            followingLines, // 'fill' or 'blank'
            verticalOffsetMm
        } = settings;

        // 1. Setup Dimensions (in Points)
        const paperDimsMm = this.getPaperDimensionsMm(paperSize, orientation);
        const widthPt = paperDimsMm.width * MM_TO_PT;
        const heightPt = paperDimsMm.height * MM_TO_PT;
        const marginMm = 20;
        const marginPt = marginMm * MM_TO_PT;
        const contentWidthPt = widthPt - (marginPt * 2);

        // Grid Settings
        const gridHeightPt = lineHeightMm * MM_TO_PT;
        const gapPt = DEFAULT_GAP_MM * MM_TO_PT;
        const rowHeightPt = gridHeightPt + gapPt;

        // Font Settings
        // With 4-line system, text should fit between line 1 (0) and line 3 (0.5)
        // That's 50% of the grid height
        const fontSizePt = gridHeightPt * 0.5;
        this.ctx.font = `${fontSizePt}px "${fontFamily}"`;

        // Text padding (left and right)
        const TEXT_PADDING_MM = 2;
        const textPaddingPt = TEXT_PADDING_MM * MM_TO_PT;

        const pages = [];
        let currentPage = { items: [], pageNumber: 1 };
        let currentY = marginPt;

        // Helper to add new page
        const startNewPage = () => {
            pages.push(currentPage);
            currentPage = { items: [], pageNumber: pages.length + 1 };
            currentY = marginPt;
        };

        // 2. Render Title
        if (pageTitle && pageTitle.trim()) {
            const titleFontSizePt = 32; // Increased from 24
            this.ctx.font = `bold ${titleFontSizePt}px "${fontFamily}"`;
            const titleWidth = this.ctx.measureText(pageTitle).width;

            // Move title higher into the margin
            const titleY = marginPt - 30;

            currentPage.items.push({
                type: 'title',
                text: pageTitle,
                x: widthPt / 2, // Center X
                y: titleY,
                width: titleWidth, // Store width for PDF centering
                fontSize: titleFontSizePt,
                font: fontFamily
            });
            // Add more spacing between title and first line
            currentY = titleY + (titleFontSizePt * 2);

            // Reset font for body
            this.ctx.font = `${fontSizePt}px "${fontFamily}"`;
        }

        // 3. Process Text
        const paragraphs = this.normalizeText(text).split('\n');

        paragraphs.forEach(paragraph => {
            if (!paragraph.trim()) return; // Skip empty paragraphs (or handle as empty line?)

            const words = paragraph.split(' ');
            let currentLineWords = [];

            // Available width for text (accounting for padding on both sides)
            const availableTextWidth = contentWidthPt - (textPaddingPt * 2);

            words.forEach(word => {
                const testLine = currentLineWords.length > 0 ? currentLineWords.join(' ') + ' ' + word : word;
                const metrics = this.ctx.measureText(testLine);

                if (metrics.width > availableTextWidth && currentLineWords.length > 0) {
                    // Line full, push currentLine
                    this.addLineToPage(currentPage, currentLineWords.join(' '), currentY, marginPt, contentWidthPt, gridHeightPt, fontSizePt, fontFamily, verticalOffsetMm, settings, textPaddingPt);
                    currentY += rowHeightPt;

                    // Check pagination
                    if (currentY + rowHeightPt > heightPt - marginPt) {
                        startNewPage();
                    }

                    // If Copying mode, add empty line
                    if (practiceMode === 'copying') {
                        this.addLineToPage(currentPage, '', currentY, marginPt, contentWidthPt, gridHeightPt, fontSizePt, fontFamily, verticalOffsetMm, settings, textPaddingPt);
                        currentY += rowHeightPt;
                        if (currentY + rowHeightPt > heightPt - marginPt) {
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
                this.addLineToPage(currentPage, currentLineWords.join(' '), currentY, marginPt, contentWidthPt, gridHeightPt, fontSizePt, fontFamily, verticalOffsetMm, settings, textPaddingPt);
                currentY += rowHeightPt;

                if (currentY + rowHeightPt > heightPt - marginPt) {
                    startNewPage();
                }

                if (practiceMode === 'copying') {
                    this.addLineToPage(currentPage, '', currentY, marginPt, contentWidthPt, gridHeightPt, fontSizePt, fontFamily, verticalOffsetMm, settings, textPaddingPt);
                    currentY += rowHeightPt;
                    if (currentY + rowHeightPt > heightPt - marginPt) {
                        startNewPage();
                    }
                }
            }
        });

        // 4. Fill remaining lines
        if (followingLines === 'fill') {
            // Safety break
            let safety = 0;
            while (currentY + rowHeightPt <= heightPt - marginPt && safety < 100) {
                this.addLineToPage(currentPage, '', currentY, marginPt, contentWidthPt, gridHeightPt, fontSizePt, fontFamily, verticalOffsetMm, settings, textPaddingPt);
                currentY += rowHeightPt;
                safety++;
            }
        }

        pages.push(currentPage);

        return {
            pages,
            widthPt,
            heightPt
        };
    }

    addLineToPage(page, text, y, x, width, height, fontSize, font, verticalOffsetMm, settings, textPaddingPt = 0) {
        // 4-Line Guide System Layout:
        // Line 1 (top):    y + 0
        // Line 2:          y + height * 0.25
        // Line 3:          y + height * 0.5
        // Line 4:          y + height * 0.75

        // Add Guide Lines
        page.items.push({
            type: 'guide',
            x: x,
            y: y,
            width: width,
            height: height,
            style: settings.guideStyle
        });

        // Add Text
        if (text) {
            // Text positioning strategy:
            // - Text should sit between Line 1 (0) and Line 3 (0.5)
            // - Baseline should be at Line 3 (0.5)
            // - Font size is 50% of grid height (distance from Line 1 to Line 3)

            const vOffsetPt = verticalOffsetMm * MM_TO_PT;

            // Calculate baseline Y position (at Line 3)
            const baselineY = y + (height * 0.5) + vOffsetPt;

            // Measure text metrics for PDF rendering
            this.ctx.font = `${fontSize}px "${font}"`;
            const metrics = this.ctx.measureText(text);
            const ascent = metrics.actualBoundingBoxAscent || (fontSize * 0.85);

            page.items.push({
                type: 'text',
                text: text,
                x: x + textPaddingPt,
                y: baselineY,
                fontSize: fontSize,
                font: font,
                color: settings.textStyle,
                align: 'left',
                ascent: ascent
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

    // Calculate total canvas height
    // Add some padding between pages
    const pageGap = 20 * scale;
    const totalHeightPt = layout.pages.reduce((acc, _) => acc + layout.heightPt, 0);
    const totalHeightPx = totalHeightPt * scale + (layout.pages.length - 1) * pageGap;

    canvas.width = layout.widthPt * scale;
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
        ctx.fillRect(0, pageY, layout.widthPt * scale, layout.heightPt * scale);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(0, pageY, layout.widthPt * scale, layout.heightPt * scale);

        // Draw Items
        page.items.forEach(item => {
            if (item.type === 'guide') {
                drawGuideOnCanvas(ctx, item, scale, pageY);
            } else if (item.type === 'text') {
                drawTextOnCanvas(ctx, item, scale, pageY);
            } else if (item.type === 'title') {
                drawTitleOnCanvas(ctx, item, scale, pageY);
            }
        });

        pageY += (layout.heightPt * scale) + pageGap;
    });
}

function drawGuideOnCanvas(ctx, item, scale, pageOffsetY) {
    if (item.style === 'none') return;

    const x = item.x * scale;
    const y = item.y * scale + pageOffsetY;
    const w = item.width * scale;
    const h = item.height * scale;

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

function drawTextOnCanvas(ctx, item, scale, pageOffsetY) {
    const x = item.x * scale;
    const y = item.y * scale + pageOffsetY; // This is baseline y

    let color = 'black';
    if (item.color === 'grey') color = '#999';
    else if (item.color === 'light') color = '#dcdcdc';

    ctx.font = `${item.fontSize * scale}px "${item.font}"`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'alphabetic'; // Important: matches PDF baseline logic
    ctx.fillText(item.text, x, y);
}

function drawTitleOnCanvas(ctx, item, scale, pageOffsetY) {
    const x = item.x * scale;
    const y = item.y * scale + pageOffsetY;

    ctx.font = `bold ${item.fontSize * scale}px "${item.font}"`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(item.text, x, y);
    ctx.textAlign = 'left'; // Reset
}

function generatePDF(layout) {
    const docContent = [];

    layout.pages.forEach((page, index) => {
        // Page Break for subsequent pages
        if (index > 0) {
            docContent.push({ text: '', pageBreak: 'before' });
        }

        page.items.forEach(item => {
            if (item.type === 'guide') {
                if (item.style === 'none') return;
                const color = item.style === 'light' ? '#dcdcdc' : '#999';

                // Draw 4 horizontal lines + 2 vertical lines
                docContent.push({
                    canvas: [
                        { type: 'line', x1: 0, y1: 0, x2: item.width, y2: 0, lineWidth: 0.5, lineColor: color }, // Top (solid)
                        { type: 'line', x1: 0, y1: item.height * 0.25, x2: item.width, y2: item.height * 0.25, lineWidth: 0.5, lineColor: color, dash: { length: 2 } }, // 0.25 (dashed)
                        { type: 'line', x1: 0, y1: item.height * 0.5, x2: item.width, y2: item.height * 0.5, lineWidth: 0.5, lineColor: color }, // 0.5 (solid)
                        { type: 'line', x1: 0, y1: item.height * 0.75, x2: item.width, y2: item.height * 0.75, lineWidth: 0.5, lineColor: color, dash: { length: 2 } }, // 0.75 (dashed)
                        { type: 'line', x1: 0, y1: 0, x2: 0, y2: item.height * 0.75, lineWidth: 0.5, lineColor: color }, // Left vertical
                        { type: 'line', x1: item.width, y1: 0, x2: item.width, y2: item.height * 0.75, lineWidth: 0.5, lineColor: color } // Right vertical
                    ],
                    absolutePosition: { x: item.x, y: item.y }
                });
            } else if (item.type === 'text') {
                let color = 'black';
                if (item.color === 'grey') color = '#999';
                else if (item.color === 'light') color = '#dcdcdc';

                // For text, absolutePosition places the top-left of the text box.
                // We have the BASELINE y stored in item.y.
                // We need to shift UP by the ascent to get the top y.
                // Using fontSize + small offset to position text higher
                const topY = item.y - item.fontSize - 2;

                docContent.push({
                    text: item.text,
                    font: item.font,
                    fontSize: item.fontSize,
                    color: color,
                    absolutePosition: { x: item.x, y: topY }
                });
            } else if (item.type === 'title') {
                // Manual centering for absolute positioning
                const leftX = item.x - (item.width / 2);

                docContent.push({
                    text: item.text,
                    font: item.font,
                    fontSize: item.fontSize,
                    bold: true,
                    absolutePosition: { x: leftX, y: item.y }
                });
            }
        });
    });

    const docDefinition = {
        pageSize: { width: layout.widthPt, height: layout.heightPt },
        pageMargins: [0, 0, 0, 0], // We handle margins
        content: docContent,
        defaultStyle: {
            font: 'Iansui' // Default
        }
    };

    pdfMake.createPdf(docDefinition).download('poj-practice.pdf');
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
        verticalOffset: document.getElementById('verticalOffset'),
        languageSelect: document.getElementById('languageSelect'),
        clearTitleBtn: document.getElementById('clearTitleBtn'),
        clearTextBtn: document.getElementById('clearTextBtn')
    };

    // Initialize Language
    if (typeof currentLanguage !== 'undefined') {
        ui.languageSelect.value = currentLanguage;
        updateUILanguage();
    }
    ui.languageSelect.addEventListener('change', (e) => switchLanguage(e.target.value));

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
            verticalOffsetMm: parseFloat(ui.verticalOffset.value) || 0
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
        ui.guideStyle, ui.textStyle, ui.verticalOffset
    ];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', update);
    });

    // Generate PDF
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
