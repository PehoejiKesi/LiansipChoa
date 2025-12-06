/**
 * Constants and Configuration
 */
window.App = window.App || {};
window.App.Core = window.App.Core || {};
window.App.Core.Constants = {
    // Conversion factors
    MM_TO_PT: 2.83465,

    // Paper dimensions (mm)
    A4_WIDTH_MM: 210,
    A4_HEIGHT_MM: 297,
    A3_WIDTH_MM: 297,
    A3_HEIGHT_MM: 420,

    // Layout defaults
    DEFAULT_GAP_MM: 0.5
};

// Helper for inverse conversion if needed locally or by other modules
// We can attach it to the Constants object if it's widely used
window.App.Core.Constants.PT_TO_MM = 1 / window.App.Core.Constants.MM_TO_PT;
