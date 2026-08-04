const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'drem-crop.jpg');
const outDir = path.join(__dirname, '..', 'src');
const sizes = [1024, 768, 480, 320];

async function ensureSrcExists() {
  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }
}

async function run() {
  await ensureSrcExists();
  for (const w of sizes) {
    const base = path.join(outDir, `drem-${w}`);
    console.log('Generating', base + '.avif');
    await sharp(src).resize({ width: w }).avif({ quality: 55 }).toFile(base + '.avif');
    console.log('Generating', base + '.webp');
    await sharp(src).resize({ width: w }).webp({ quality: 75 }).toFile(base + '.webp');
  }
  console.log('Drem conversions complete.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
