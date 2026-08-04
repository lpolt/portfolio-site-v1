const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'bridge-1.jpg'); // source reference kept for clarity; conversions already created from this file
const outDir = path.join(__dirname, '..', 'src');
const sizes = [1920, 1600, 1280, 1024];

async function ensureSrcExists() {
  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }
}

async function run() {
  await ensureSrcExists();
  for (const w of sizes) {
    const base = path.join(outDir, `bridge-${w}`);
    console.log('Generating', base + '.avif');
    await sharp(src)
      .resize({ width: w })
      .avif({ quality: 55 })
      .toFile(base + '.avif');
    console.log('Generating', base + '.webp');
    await sharp(src)
      .resize({ width: w })
      .webp({ quality: 75 })
      .toFile(base + '.webp');
  }

  // small blurred LQIP
  const lqipPath = path.join(outDir, 'bridge-lqip.jpg');
  console.log('Generating LQIP', lqipPath);
  await sharp(src)
    .resize({ width: 40 })
    .blur(5)
    .jpeg({ quality: 40 })
    .toFile(lqipPath);

  console.log('All conversions complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
