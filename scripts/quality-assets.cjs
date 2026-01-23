const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSET_DIR = path.join(ROOT, 'src', 'assets');
const MAX_BYTES = Number(process.env.ASSET_MAX_BYTES || 1_500_000);
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }
    if (IMAGE_EXTS.has(path.extname(entry.name))) {
      return [fullPath];
    }
    return [];
  });
}

const files = collectFiles(ASSET_DIR);
const offenders = files
  .map((filePath) => {
    const { size } = fs.statSync(filePath);
    return { filePath, size };
  })
  .filter(({ size }) => size > MAX_BYTES);

if (offenders.length) {
  console.error(`Images larger than ${(MAX_BYTES / 1_000_000).toFixed(2)}MB:`);
  offenders.forEach(({ filePath, size }) => {
    console.error(`- ${path.relative(ROOT, filePath)} (${(size / 1_000_000).toFixed(2)}MB)`);
  });
  process.exit(1);
}

console.log(`All images are under ${(MAX_BYTES / 1_000_000).toFixed(2)}MB.`);
