const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = 8081;
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'assets', 'pre_made');
const PREVIEW_DIR = path.join(OUTPUT_DIR, 'preview');

// Mappings: Preset Key in dropdown -> Output Filename Base
const PRESETS = {
    'vowels': 'POJ_LiansipChoa_Boim',
    'consonants': 'POJ_LiansipChoa_Chuim',
    'tones': 'POJ_LiansipChoa_Sianntiau',
    'nasals': 'POJ_LiansipChoa_PhinnimHoaKooBoimJiboe',
    'nasal_compounds': 'POJ_LiansipChoa_PhinnimHoaHokBoimJiboe',
    'nasal_codas': 'POJ_LiansipChoa_PhinnChuimBoeliuJiboe',
    'basic_stop_codas': 'POJ_LiansipChoa_KipunSokimJiboe',
    'ptk_stop_codas': 'POJ_LiansipChoa_PTKSokimJiboe'
};

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR, { recursive: true });

// Simple Static Server
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.pdf': 'application/pdf',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(ROOT_DIR, req.url === '/' ? 'index.html' : req.url);
    filePath = filePath.split('?')[0];

    // Security check to prevent traversing out of root
    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Error: ' + error.code);
            }
        } else {
            const extname = path.extname(filePath);
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

async function run() {
    console.log(`Starting server on port ${PORT}...`);
    server.listen(PORT);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Intercept window.open to capture PDF Blob URL
    await page.evaluateOnNewDocument(() => {
        window.open = (url) => {
            console.log('Intercepted window.open with URL:', url);
            window.capturedPdfUrl = url;
            return { focus: () => { } }; // Mock return object
        };
    });

    page.on('console', msg => {
        const text = msg.text();
        // Filter noisy logs if needed
        console.log('BROWSER:', text);
    });

    try {
        console.log('Navigating to app...');
        await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

        // Set Language to POJ
        console.log('Setting language to POJ...');
        await page.click('button[data-lang="poj"]');
        await new Promise(r => setTimeout(r, 500));

        for (const [presetKey, filenameBase] of Object.entries(PRESETS)) {
            console.log(`Processing preset: ${presetKey} -> ${filenameBase}`);

            // 1. Select Preset
            await page.select('#presetSelect', presetKey);
            // Wait for render/fonts
            await new Promise(r => setTimeout(r, 1500));

            // 2. Capture Preview
            const canvasElement = await page.$('#previewCanvas');
            if (canvasElement) {
                const previewPath = path.join(PREVIEW_DIR, `${filenameBase}.jpg`);
                await canvasElement.screenshot({
                    path: previewPath,
                    type: 'jpeg',
                    quality: 90
                });
                console.log(`  Preview saved: ${previewPath}`);
            }

            // 3. Generate PDF
            // Clear capture variable
            await page.evaluate(() => { window.capturedPdfUrl = null; });

            // Click generate
            await page.click('#generateBtn');

            // Wait for capture
            try {
                await page.waitForFunction(() => window.capturedPdfUrl, { timeout: 10000 });
            } catch (e) {
                console.error(`  Timeout waiting for window.open callback for ${presetKey}`);
                continue;
            }

            // Fetch Blob Data
            const pdfDataArray = await page.evaluate(async () => {
                const url = window.capturedPdfUrl;
                if (!url) return null;
                const response = await fetch(url);
                const buffer = await response.arrayBuffer();
                return Array.from(new Uint8Array(buffer));
            });

            if (pdfDataArray) {
                const targetPath = path.join(OUTPUT_DIR, `${filenameBase}.pdf`);
                fs.writeFileSync(targetPath, Buffer.from(pdfDataArray));
                console.log(`  PDF saved: ${targetPath}`);
            } else {
                console.error(`  Failed to fetch PDF data for ${presetKey}`);
            }
        }

    } catch (e) {
        console.error('Script Error:', e);
    } finally {
        await browser.close();
        server.close();
        console.log('Done.');
        process.exit(0);
    }
}

run();
