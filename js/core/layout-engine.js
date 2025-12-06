/**
 * Layout Engine
 * Calculates positioning of text and guides for PDF and Canvas
 */
window.App.Core.LayoutEngine = class LayoutEngine {
    constructor(ctx) {
        this.ctx = ctx;
        this.C = window.App.Core.Constants;
    }

    /**
     * Generates complete layout for practice worksheets
     * @param {Object} settings - Layout settings
     * @param {string} settings.orientation - Page orientation ('portrait' or 'landscape')
     * @param {number} settings.lineHeightMm - Height of each practice line in mm
     * @param {string} settings.fontFamily - Font family to use
     * @param {string} settings.pageTitle - Optional page title
     * @param {string} settings.practiceMode - Practice mode ('tracing' or 'copying')
     * @param {string} settings.followingLines - How to fill remaining lines ('fill' or 'blank')
     * @returns {Object} Layout object with pages, dimensions
     */
    generateLayout(settings) {
        const { MM_TO_PT, PT_TO_MM, DEFAULT_GAP_MM } = this.C;

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
        const { MM_TO_PT, PT_TO_MM } = this.C;

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
