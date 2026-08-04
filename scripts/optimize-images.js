const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'src');

async function genDrem() {
  const src = path.join(outDir, 'drem-crop.jpg');
  if (!fs.existsSync(src)) { console.warn('drem-crop.jpg not found, skipping drem tasks'); return; }
  const sizes = [1024, 768, 480, 320];
  for (const w of sizes) {
    const base = path.join(outDir, `drem-${w}`);
    console.log('Generating', base + '.avif');
    await sharp(src).resize({ width: w }).avif({ quality: 60 }).toFile(base + '.avif');
    console.log('Generating', base + '.webp');
    await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(base + '.webp');
  }
}

async function genPfp() {
  const srcName = 'square mug-2.jpg';
  const src = path.join(outDir, srcName);
  if (!fs.existsSync(src)) { console.warn(srcName, 'not found, skipping pfp tasks'); return; }
  const sizes = [768, 480, 320];
  for (const w of sizes) {
    const base = path.join(outDir, `pfp-${w}`);
    console.log('Generating', base + '.avif');
    await sharp(src).resize({ width: w }).avif({ quality: 65 }).toFile(base + '.avif');
    console.log('Generating', base + '.webp');
    await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(base + '.webp');
  }
  // LQIP
  const lqip = path.join(outDir, 'pfp-lqip.jpg');
  console.log('Generating', lqip);
  await sharp(src).resize({ width: 40 }).blur(5).jpeg({ quality: 40 }).toFile(lqip);
}

async function genLogos() {
  const logos = ['Drem-Labs-Wordmark.png','bscu-logo.png','bscu-logo-w.png','flourish-wordmark.png','flourish-wordmark-w.png','laptop-96.png'];
  for (const name of logos) {
    const src = path.join(outDir, name);
    if (!fs.existsSync(src)) { continue; }
    const base = path.join(outDir, name.replace(/\.png$/i, ''));
    try {
      console.log('Generating', base + '.webp');
      await sharp(src).webp({ quality: 80 }).toFile(base + '.webp');
    } catch (err) {
      console.warn('Failed to convert', name, err.message);
    }
  }
}

async function run() {
  await genDrem();
  await genPfp();
  await genLogos();
  console.log('Optimization complete.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});