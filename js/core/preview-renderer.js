/**
 * Preview Renderer
 * Renders the layout to a Canvas element for preview
 */
window.App.Core.PreviewRenderer = {
    /**
     * Renders layout to canvas for preview
     * @param {Object} layout - Layout object from LayoutEngine
     * @param {string} canvasId - Canvas element ID
     */
    renderPreview: function (layout, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const C = window.App.Core.Constants;

        const scale = 2;
        const MM_TO_PX = C.MM_TO_PT * scale;

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
                    this.drawGuideOnCanvas(ctx, item, MM_TO_PX, pageY);
                } else if (item.type === 'text') {
                    this.drawTextOnCanvas(ctx, item, MM_TO_PX, pageY);
                } else if (item.type === 'title') {
                    this.drawTitleOnCanvas(ctx, item, MM_TO_PX, pageY);
                } else if (item.type === 'footer') {
                    this.drawFooterOnCanvas(ctx, item, MM_TO_PX, pageY);
                }
            });

            pageY += pageHeightPx + pageGap;
        });
    },

    drawGuideOnCanvas: function (ctx, item, mmToPx, pageOffsetY) {
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
    },

    drawTextOnCanvas: function (ctx, item, mmToPx, pageOffsetY) {
        const x = item.xMm * mmToPx;
        const y = item.yMm * mmToPx + pageOffsetY;

        let color = 'black';
        if (item.color === 'grey') color = '#999';
        else if (item.color === 'light') color = '#dcdcdc';

        ctx.font = `${item.fontSizeMm * mmToPx}px "${item.font}"`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(item.text, x, y);
    },

    drawTitleOnCanvas: function (ctx, item, mmToPx, pageOffsetY) {
        const x = item.xMm * mmToPx;
        const y = item.yMm * mmToPx + pageOffsetY;

        ctx.font = `bold ${item.fontSizeMm * mmToPx}px "${item.font}"`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(item.text, x, y);
        ctx.textAlign = 'left';
    },

    drawFooterOnCanvas: function (ctx, item, mmToPx, pageOffsetY) {
        const x = item.xMm * mmToPx;
        const y = item.yMm * mmToPx + pageOffsetY;

        ctx.font = `${item.fontSizeMm * mmToPx}px "${item.font}"`;
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(item.text, x, y);
        ctx.textAlign = 'left';
    }
};
