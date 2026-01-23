const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const STYLE_DIR = path.join(SRC_DIR, 'styles');

const IMG_TAG_RE = /<img\b[^>]*>/g;
const ALT_RE = /\salt=({[^}]*}|["'][^"']*["'])/;

function collectFiles(dir, exts) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath, exts);
    }
    if (exts.includes(path.extname(entry.name))) {
      return [fullPath];
    }
    return [];
  });
}

function checkImgAlts() {
  const files = collectFiles(SRC_DIR, ['.jsx', '.html', '.js']);
  const missing = [];

  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.matchAll(IMG_TAG_RE);

    for (const match of matches) {
      const tag = match[0];
      if (!ALT_RE.test(tag)) {
        const prefix = content.slice(0, match.index);
        const line = prefix.split('\n').length;
        missing.push(`${path.relative(ROOT, filePath)}:${line}`);
      }
    }
  });

  if (missing.length) {
    console.error('Missing alt attributes on <img> tags:\n', missing.join('\n'));
    return false;
  }
  return true;
}

function checkMotionFallbacks() {
  const files = collectFiles(STYLE_DIR, ['.css']);
  const offenders = [];

  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasMotion = /@keyframes|animation\s*:/.test(content);
    if (!hasMotion) return;
    if (!/prefers-reduced-motion/.test(content)) {
      offenders.push(path.relative(ROOT, filePath));
    }
  });

  if (offenders.length) {
    console.error('Motion without prefers-reduced-motion fallback in:\n', offenders.join('\n'));
    return false;
  }
  return true;
}

const ok = checkImgAlts() & checkMotionFallbacks();
process.exit(ok ? 0 : 1);
