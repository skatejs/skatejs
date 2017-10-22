import fs from 'fs';
import path from 'path';

const sampleRoot = path.resolve(__dirname, '..', '..', 'test', 'samples');

function filterSource(src) {
  return String(src)
    .replace('../../..', 'skatejs')
    .replace('/umd', '');
}

function load(name, file) {
  const filePath = path.join(sampleRoot, name);
  const sourceFile = path.join(filePath, file);
  if (fs.existsSync(sourceFile)) {
    return fs.readFileSync(sourceFile, 'utf8');
  }
}

export function sample(name) {
  return {
    code: filterSource(load(name, 'index.js')),
    html: load(name, 'index.html')
  };
}
