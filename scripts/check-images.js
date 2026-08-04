const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const MAX_BYTES = 2000000; // 2MB threshold
const EXTS = ['.jpg', '.jpeg', '.png'];

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.log('No src directory; skipping image checks.');
    process.exit(0);
  }
  const files = walk(SRC_DIR).filter((f) =>
    EXTS.includes(path.extname(f).toLowerCase()),
  );
  const offenders = [];
  for (const f of files) {
    const size = fs.statSync(f).size;
    if (size > MAX_BYTES)
      offenders.push({ file: path.relative(process.cwd(), f), size });
  }

  if (offenders.length) {
    console.error(
      '\nImage size policy violation: the following source images exceed ' +
        MAX_BYTES / 1000000 +
        'MB:\n',
    );
    for (const o of offenders) {
      console.error(` - ${o.file}: ${(o.size / 1000000).toFixed(2)} MB`);
    }
    console.error(
      '\nRecommendation: generate responsive AVIF/WebP variants and remove or compress original large files.',
    );
    process.exit(1);
  }
  console.log(
    'Image size check passed. No source images larger than ' +
      MAX_BYTES / 1000000 +
      'MB.',
  );
}

main();
