

/**
 * PDF Generator
 * Generates and downloads PDF using pdfMake
 */
window.App.Core.pdfGenerator = function (layout, pageTitle = '') {
    const C = window.App.Core.Constants;
    const MM_TO_PT = C.MM_TO_PT;

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
                    'Lesson One': 1.27,
                    'Open Huninn': 1.00,
                    'Iansui': 1.12,
                    'Chiayi City': 1.36
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

    // Generate filename with title
    let filename = 'POJ_LiansipChoa';
    if (pageTitle && pageTitle.trim()) {
        // Sanitize title for filename (remove invalid characters)
        const sanitizedTitle = pageTitle.trim().replace(/[/\\?%*:|"<>]/g, '-');
        filename += '_' + sanitizedTitle;
    }
    filename += '.pdf';

    pdfMake.createPdf(docDefinition).open();
}
