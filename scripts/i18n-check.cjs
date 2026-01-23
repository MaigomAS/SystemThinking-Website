const fs = require('fs');
const path = require('path');

const esPath = path.join(__dirname, '..', 'src', 'data', 'i18n', 'es.json');
const enPath = path.join(__dirname, '..', 'src', 'data', 'i18n', 'en.json');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

const collectMissingKeys = (source, target, prefix = '') => {
  if (Array.isArray(source)) {
    if (!Array.isArray(target)) return [prefix || '(root array)'];
    return [];
  }
  if (!isPlainObject(source)) return [];
  const missing = [];
  for (const [key, value] of Object.entries(source)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (!(key in target)) {
      missing.push(nextPrefix);
      continue;
    }
    missing.push(...collectMissingKeys(value, target[key], nextPrefix));
  }
  return missing;
};

const esData = readJson(esPath);
const enData = readJson(enPath);

const missing = collectMissingKeys(esData, enData);

if (missing.length) {
  console.error('Missing keys in en.json:');
  missing.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

console.log('i18n check passed: all es.json keys exist in en.json.');
