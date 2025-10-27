// Regenerate PNG logo from the canonical SVG
// Usage:
//   npm i -D sharp
//   node scripts/render-logo.js
// Outputs:
//   assets-bundle/png/gift-huddle_1024x320.png
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.resolve(__dirname, '..', 'assets-bundle', 'svg', 'Gift-Huddle.svg');
const outDir = path.resolve(__dirname, '..', 'assets-bundle', 'png');
const outPath = path.join(outDir, 'gift-huddle_1024x320.png');

(async () => {
  try {
    const svg = fs.readFileSync(svgPath);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    // 1024x320 to match existing asset name
    await sharp(svg, { density: 300 })
      .resize(1024, 320, { fit: 'contain', withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    console.log('Wrote', outPath);
  } catch (err) {
    console.error('Failed to render logo:', err);
    process.exit(1);
  }
})();
