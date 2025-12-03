// POJ Handwriting Practice Generator - v3.0 (Unified Layout Engine)

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/** Conversion factor from millimeters to points */
const MM_TO_PT = 2.83465;

/** Conversion factor from points to millimeters */
const PT_TO_MM = 1 / MM_TO_PT;

/** Default gap between practice lines in millimeters */
const DEFAULT_GAP_MM = 0.5;

// ============================================================================
// FONT MANAGEMENT
// ============================================================================

/**
 * Registers custom fonts with pdfMake library
 * Loads font data from global base64 variables and configures font families
 */
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

/** Cache for loaded preview fonts */
const fontCache = {};

/**
 * Loads custom fonts for canvas preview rendering
 * Converts base64 font data to FontFace objects and adds them to the document
 * @returns {Promise<void>}
 */
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

/**
 * Maps font filename to font family name
 * @param {string} filename - Font filename (e.g., "Iansui-Regular.ttf")
 * @returns {string} Font family name (e.g., "Iansui")
 */
function getFontFamilyName(filename) {
    const fontMap = {
        'Iansui-Regular.ttf': 'Iansui',
        'jf-openhuninn.ttf': 'OpenHuninn',
        'ChiayiCity.ttf': 'ChiayiCity',
        'LessonOne-Regular.ttf': 'LessonOne'
    };
    return fontMap[filename] || 'Iansui';
}

// ============================================================================
// LAYOUT ENGINE
// ============================================================================

/**
 * Layout engine for generating practice worksheet layouts
 * Handles text measurement, pagination, and layout item generation
 * All calculations are done in millimeters (mm) for consistency
 */
class LayoutEngine {
    /**
     * Creates a new LayoutEngine instance
     * @param {CanvasRenderingContext2D} ctx - Canvas context for text measurement
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * Generates complete layout for practice worksheets
     * @param {Object} settings - Layout settings
     * @param {string} settings.text - Text to practice
     * @param {string} settings.paperSize - Paper size ('a4' or 'a3')
     * @param {string} settings.orientation - Page orientation ('portrait' or 'landscape')
     * @param {number} settings.lineHeightMm - Height of each practice line in mm
     * @param {string} settings.fontFamily - Font family to use
     * @param {string} settings.pageTitle - Optional page title
     * @param {string} settings.practiceMode - Practice mode ('tracing' or 'copying')
     * @param {string} settings.followingLines - How to fill remaining lines ('fill' or 'blank')
     * @returns {Object} Layout object with pages, dimensions
     */
    generateLayout(settings) {
        const {
            text,
            paperSize,
            orientation,
            lineHeightMm,
            fontFamily,
            pageTitle,
            practiceMode,
            followingLines
        } = settings;

        // Setup page dimensions (all in MM)
        const paperDimsMm = this.getPaperDimensionsMm(paperSize, orientation);
        const widthMm = paperDimsMm.width;
        const heightMm = paperDimsMm.height;
        const marginMm = 12;

        // Footer configuration (in MM)
        const footerFontSizeMm = 16 * PT_TO_MM;
        const footerYMm = heightMm - marginMm - footerFontSizeMm;
        const footerTopMarginMm = 5;
        const maxContentYMm = footerYMm - footerTopMarginMm;
        const contentWidthMm = widthMm - (marginMm * 2);

        // Grid configuration (in MM)
        const gridHeightMm = lineHeightMm;
        const gapMm = DEFAULT_GAP_MM;
        const rowHeightMm = gridHeightMm + gapMm;

        // Font configuration (in MM)
        // With 4-line system, text fits between line 1 (0) and line 3 (0.5)
        // That's 50% of the grid height
        const fontSizeMm = gridHeightMm * 0.5;

        // Set font for text measurement (convert to pt/px temporarily)
        const fontSizePt = fontSizeMm * MM_TO_PT;
        this.ctx.font = `${fontSizePt}px "${fontFamily}"`;

        // Text padding (left and right) in MM
        const textPaddingMm = 2;

        const pages = [];
        let currentPage = { items: [], pageNumber: 1 };
        let currentYMm = this.addTitleToPage(currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);

        // Process text into lines
        const paragraphs = this.normalizeText(text).split('\n');

        paragraphs.forEach(paragraph => {
            if (!paragraph.trim()) {
                // Handle empty line
                if (currentYMm + gridHeightMm > maxContentYMm) {
                    currentPage = this.startNewPage(pages, currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                    currentYMm = this.addTitleToPage(currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                }
                this.addLineToPage(currentPage, '', currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                currentYMm += rowHeightMm;
                return;
            }

            const words = paragraph.split(' ');
            let currentLineWords = [];

            // Available width for text (accounting for padding) in MM
            const availableTextWidthMm = contentWidthMm - (textPaddingMm * 2);
            const availableTextWidthPx = availableTextWidthMm * MM_TO_PT;

            words.forEach(word => {
                const testLine = currentLineWords.length > 0 ? currentLineWords.join(' ') + ' ' + word : word;
                const metrics = this.ctx.measureText(testLine);

                if (metrics.width > availableTextWidthPx && currentLineWords.length > 0) {
                    // Line is full, render current line
                    if (currentYMm + gridHeightMm > maxContentYMm) {
                        currentPage = this.startNewPage(pages, currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                        currentYMm = this.addTitleToPage(currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                    }

                    this.addLineToPage(currentPage, currentLineWords.join(' '), currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                    currentYMm += rowHeightMm;

                    // Add blank line for copying mode
                    if (practiceMode === 'copying') {
                        if (currentYMm + gridHeightMm > maxContentYMm) {
                            currentPage = this.startNewPage(pages, currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                            currentYMm = this.addTitleToPage(currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                        }
                        this.addLineToPage(currentPage, '', currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                        currentYMm += rowHeightMm;
                    }

                    currentLineWords = [word];
                } else {
                    currentLineWords.push(word);
                }
            });

            // Render remaining words
            if (currentLineWords.length > 0) {
                if (currentYMm + gridHeightMm > maxContentYMm) {
                    currentPage = this.startNewPage(pages, currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                    currentYMm = this.addTitleToPage(currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                }
                this.addLineToPage(currentPage, currentLineWords.join(' '), currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                currentYMm += rowHeightMm;

                if (practiceMode === 'copying') {
                    if (currentYMm + gridHeightMm > maxContentYMm) {
                        currentPage = this.startNewPage(pages, currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                        currentYMm = this.addTitleToPage(currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt);
                    }
                    this.addLineToPage(currentPage, '', currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                    currentYMm += rowHeightMm;
                }
            }
        });

        // Fill remaining lines on current page
        if (currentPage.items.length === 0 || (followingLines === 'fill' && currentPage.items.length > 0)) {
            let safety = 0;
            while (currentYMm + gridHeightMm <= maxContentYMm && safety < 100) {
                this.addLineToPage(currentPage, '', currentYMm, marginMm, contentWidthMm, gridHeightMm, fontSizeMm, fontFamily, settings, textPaddingMm);
                currentYMm += rowHeightMm;
                safety++;
            }
        }

        // Add current page if it has content
        if (currentPage.items.length > 0) {
            pages.push(currentPage);
        }

        // Add footer to all pages
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

    /**
     * Adds title to page and returns the Y position where content should start
     * @param {Object} page - Page object to add title to
     * @param {string} pageTitle - Title text
     * @param {number} widthMm - Page width in mm
     * @param {number} contentWidthMm - Content width in mm
     * @param {number} marginMm - Page margin in mm
     * @param {string} fontFamily - Font family
     * @param {number} fontSizePt - Body font size in pt (for resetting context)
     * @returns {number} Y position in mm where content should start
     */
    addTitleToPage(page, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt) {
        if (pageTitle && pageTitle.trim()) {
            let titleFontSizeMm = 32 * PT_TO_MM;
            let titleFontSizePt = titleFontSizeMm * MM_TO_PT;
            this.ctx.font = `bold ${titleFontSizePt}px "${fontFamily}"`;
            let titleWidthPx = this.ctx.measureText(pageTitle).width;
            let titleWidthMm = titleWidthPx * PT_TO_MM;

            // Auto-shrink if title exceeds available width
            if (titleWidthMm > contentWidthMm) {
                const scaleFactor = contentWidthMm / titleWidthMm;
                titleFontSizeMm = titleFontSizeMm * scaleFactor;
                titleFontSizePt = titleFontSizeMm * MM_TO_PT;

                this.ctx.font = `bold ${titleFontSizePt}px "${fontFamily}"`;
                titleWidthPx = this.ctx.measureText(pageTitle).width;
                titleWidthMm = titleWidthPx * PT_TO_MM;
            }

            const titleYMm = marginMm;
            page.items.push({
                type: 'title',
                text: pageTitle,
                xMm: widthMm / 2,
                yMm: titleYMm,
                widthMm: titleWidthMm,
                fontSizeMm: titleFontSizeMm,
                font: fontFamily
            });

            // Reset font for body text
            this.ctx.font = `${fontSizePt}px "${fontFamily}"`;

            const titleBottomMarginMm = 10;
            return titleYMm + titleFontSizeMm + titleBottomMarginMm;
        }
        return marginMm;
    }

    /**
     * Starts a new page, pushing the current page to the pages array
     * @param {Array} pages - Array of pages
     * @param {Object} currentPage - Current page object
     * @param {string} pageTitle - Page title
     * @param {number} widthMm - Page width in mm
     * @param {number} contentWidthMm - Content width in mm
     * @param {number} marginMm - Page margin in mm
     * @param {string} fontFamily - Font family
     * @param {number} fontSizePt - Body font size in pt
     * @returns {Object} New page object
     */
    startNewPage(pages, currentPage, pageTitle, widthMm, contentWidthMm, marginMm, fontFamily, fontSizePt) {
        pages.push(currentPage);
        return { items: [], pageNumber: pages.length + 1 };
    }

    /**
     * Adds a practice line to the page with guide lines and optional text
     * @param {Object} page - Page object
     * @param {string} text - Text to display on the line
     * @param {number} yMm - Y position in mm
     * @param {number} xMm - X position in mm
     * @param {number} widthMm - Line width in mm
     * @param {number} heightMm - Line height in mm
     * @param {number} fontSizeMm - Font size in mm
     * @param {string} font - Font family
     * @param {Object} settings - Layout settings
     * @param {number} textPaddingMm - Text padding in mm
     */
    addLineToPage(page, text, yMm, xMm, widthMm, heightMm, fontSizeMm, font, settings, textPaddingMm = 0) {
        // 4-Line Guide System Layout:
        // Line 1 (top):    y + 0
        // Line 2:          y + height * 0.25
        // Line 3:          y + height * 0.5
        // Line 4:          y + height * 0.75

        // Add guide lines
        page.items.push({
            type: 'guide',
            xMm: xMm,
            yMm: yMm,
            widthMm: widthMm,
            heightMm: heightMm,
            style: settings.guideStyle
        });

        // Add text if provided
        if (text) {
            // Text baseline should be at Line 3 (0.5)
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

    /**
     * Gets paper dimensions in millimeters
     * @param {string} size - Paper size ('a4' or 'a3')
     * @param {string} orientation - Orientation ('portrait' or 'landscape')
     * @returns {Object} Object with width and height in mm
     */
    getPaperDimensionsMm(size, orientation) {
        let width, height;
        if (size === 'a3') {
            width = 297;
            height = 420;
        } else {
            width = 210;
            height = 297;
        }

        if (orientation === 'landscape') {
            return { width: height, height: width };
        }
        return { width, height };
    }

    /**
     * Normalizes text to NFC Unicode form
     * @param {string} text - Text to normalize
     * @returns {string} Normalized text
     */
    normalizeText(text) {
        return text.normalize('NFC');
    }
}

// ============================================================================
// CANVAS PREVIEW RENDERER
// ============================================================================

/**
 * Renders layout to canvas for preview
 * @param {Object} layout - Layout object from LayoutEngine
 * @param {string} canvasId - Canvas element ID
 */
function renderPreview(layout, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const scale = 2;
    const MM_TO_PX = MM_TO_PT * scale;

    // Calculate total canvas height
    const pageGap = 20 * scale;
    const pageHeightPx = layout.heightMm * MM_TO_PX;
    const totalHeightPx = pageHeightPx * layout.pages.length + (layout.pages.length - 1) * pageGap;

    canvas.width = layout.widthMm * MM_TO_PX;
    canvas.height = totalHeightPx;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    // Clear canvas
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let pageY = 0;

    layout.pages.forEach(page => {
        // Draw page background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, pageY, layout.widthMm * MM_TO_PX, pageHeightPx);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(0, pageY, layout.widthMm * MM_TO_PX, pageHeightPx);

        // Draw page items
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

/**
 * Draws guide lines on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} item - Guide item
 * @param {number} mmToPx - MM to pixel conversion factor
 * @param {number} pageOffsetY - Page Y offset in pixels
 */
function drawGuideOnCanvas(ctx, item, mmToPx, pageOffsetY) {
    if (item.style === 'none') return;

    const x = item.xMm * mmToPx;
    const y = item.yMm * mmToPx + pageOffsetY;
    const w = item.widthMm * mmToPx;
    const h = item.heightMm * mmToPx;

    const color = item.style === 'light' ? '#dcdcdc' : '#999';

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Top line (solid)
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

/**
 * Draws practice text on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} item - Text item
 * @param {number} mmToPx - MM to pixel conversion factor
 * @param {number} pageOffsetY - Page Y offset in pixels
 */
function drawTextOnCanvas(ctx, item, mmToPx, pageOffsetY) {
    const x = item.xMm * mmToPx;
    const y = item.yMm * mmToPx + pageOffsetY;

    let color = 'black';
    if (item.color === 'grey') color = '#999';
    else if (item.color === 'light') color = '#dcdcdc';

    ctx.font = `${item.fontSizeMm * mmToPx}px "${item.font}"`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(item.text, x, y);
}

/**
 * Draws page title on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} item - Title item
 * @param {number} mmToPx - MM to pixel conversion factor
 * @param {number} pageOffsetY - Page Y offset in pixels
 */
function drawTitleOnCanvas(ctx, item, mmToPx, pageOffsetY) {
    const x = item.xMm * mmToPx;
    const y = item.yMm * mmToPx + pageOffsetY;

    ctx.font = `bold ${item.fontSizeMm * mmToPx}px "${item.font}"`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(item.text, x, y);
    ctx.textAlign = 'left';
}

/**
 * Draws page footer on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} item - Footer item
 * @param {number} mmToPx - MM to pixel conversion factor
 * @param {number} pageOffsetY - Page Y offset in pixels
 */
function drawFooterOnCanvas(ctx, item, mmToPx, pageOffsetY) {
    const x = item.xMm * mmToPx;
    const y = item.yMm * mmToPx + pageOffsetY;

    ctx.font = `${item.fontSizeMm * mmToPx}px "${item.font}"`;
    ctx.fillStyle = '#999';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(item.text, x, y);
    ctx.textAlign = 'left';
}

// ============================================================================
// PDF GENERATOR
// ============================================================================

/**
 * Generates and downloads PDF from layout
 * @param {Object} layout - Layout object from LayoutEngine
 */
function generatePDF(layout) {
    const docContent = [];

    const widthPt = layout.widthMm * MM_TO_PT;
    const heightPt = layout.heightMm * MM_TO_PT;

    layout.pages.forEach((page, index) => {
        // Add page break for subsequent pages
        if (index > 0) {
            docContent.push({ text: '', pageBreak: 'before' });
        }

        page.items.forEach(item => {
            if (item.type === 'guide') {
                if (item.style === 'none') return;
                const color = item.style === 'light' ? '#dcdcdc' : '#999';

                const xPt = item.xMm * MM_TO_PT;
                const yPt = item.yMm * MM_TO_PT;
                const widthPt = item.widthMm * MM_TO_PT;
                const heightPt = item.heightMm * MM_TO_PT;

                // Draw 4 horizontal lines + 2 vertical lines
                docContent.push({
                    canvas: [
                        { type: 'line', x1: 0, y1: 0, x2: widthPt, y2: 0, lineWidth: 0.5, lineColor: color },
                        { type: 'line', x1: 0, y1: heightPt * 0.25, x2: widthPt, y2: heightPt * 0.25, lineWidth: 0.5, lineColor: color, dash: { length: 2 } },
                        { type: 'line', x1: 0, y1: heightPt * 0.5, x2: widthPt, y2: heightPt * 0.5, lineWidth: 0.5, lineColor: color },
                        { type: 'line', x1: 0, y1: heightPt * 0.75, x2: widthPt, y2: heightPt * 0.75, lineWidth: 0.5, lineColor: color, dash: { length: 2 } },
                        { type: 'line', x1: 0, y1: 0, x2: 0, y2: heightPt * 0.75, lineWidth: 0.5, lineColor: color },
                        { type: 'line', x1: widthPt, y1: 0, x2: widthPt, y2: heightPt * 0.75, lineWidth: 0.5, lineColor: color }
                    ],
                    absolutePosition: { x: xPt, y: yPt }
                });
            } else if (item.type === 'text') {
                let color = 'black';
                if (item.color === 'grey') color = '#999';
                else if (item.color === 'light') color = '#dcdcdc';

                const xPt = item.xMm * MM_TO_PT;
                const baselineYPt = item.yMm * MM_TO_PT;
                const fontSizePt = item.fontSizeMm * MM_TO_PT;

                // Font-specific correction factors for PDF rendering
                const fontCorrectionFactors = {
                    'LessonOne': 1.27,
                    'OpenHuninn': 1.00,
                    'Iansui': 1.12,
                    'ChiayiCity': 1.36,
                };

                const correctionFactor = fontCorrectionFactors[item.font] || 0.95;
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
                const yPt = item.yMm * MM_TO_PT;
                const fontSizePt = item.fontSizeMm * MM_TO_PT;

                docContent.push({
                    text: item.text,
                    font: item.font,
                    fontSize: fontSizePt,
                    bold: true,
                    alignment: 'center',
                    absolutePosition: { x: 0, y: yPt },
                    width: widthPt
                });
            } else if (item.type === 'footer') {
                const yPt = item.yMm * MM_TO_PT;
                const fontSizePt = item.fontSizeMm * MM_TO_PT;

                docContent.push({
                    text: item.text,
                    font: item.font,
                    fontSize: fontSizePt,
                    color: '#999',
                    alignment: 'center',
                    absolutePosition: { x: 0, y: yPt },
                    width: widthPt
                });
            }
        });
    });

    const docDefinition = {
        pageSize: { width: widthPt, height: heightPt },
        pageMargins: [0, 0, 0, 0],
        content: docContent,
        defaultStyle: {
            font: 'Iansui'
        }
    };

    pdfMake.createPdf(docDefinition).download('POJ_Liansip_Choa.pdf');
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // UI element references
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

    // Initialize language
    if (typeof currentLanguage !== 'undefined') {
        ui.languageSelect.value = currentLanguage;
        updateUILanguage();
    }

    // Language change handler
    ui.languageSelect.addEventListener('change', (e) => {
        switchLanguage(e.target.value);
        const currentPreset = ui.presetSelect.value;
        if (currentPreset !== 'custom' && PRESETS[currentPreset]) {
            const lang = e.target.value;
            ui.pageTitle.value = PRESETS[currentPreset].title[lang] || PRESETS[currentPreset].title.poj;
        }
    });

    // Clear button handlers
    if (ui.clearTitleBtn) {
        ui.clearTitleBtn.addEventListener('click', () => {
            ui.pageTitle.value = '';
            update();
        });
    }
    if (ui.clearTextBtn) {
        ui.clearTextBtn.addEventListener('click', () => {
            ui.inputText.value = '';
            update();
        });
    }

    /**
     * Updates preview based on current settings
     */
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

        const measureCanvas = document.createElement('canvas');
        const ctx = measureCanvas.getContext('2d');
        const engine = new LayoutEngine(ctx);

        const layout = engine.generateLayout(settings);
        renderPreview(layout, 'previewCanvas');

        window.currentLayout = layout;
    };

    // Input change listeners
    const inputs = [
        ui.inputText, ui.paperSize, ui.lineHeight, ui.fontSelect,
        ui.pageTitle, ui.orientation, ui.practiceMode, ui.followingLines,
        ui.guideStyle, ui.textStyle
    ];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', update);
    });

    // Preset selection handler
    ui.presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val !== 'custom' && PRESETS[val]) {
            const preset = PRESETS[val];
            ui.inputText.value = preset.text;
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

    // PDF generation handler
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

    // Initial load
    loadPreviewFonts().then(() => {
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
