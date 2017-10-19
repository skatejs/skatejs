const fs = require('fs');
const path = require('path');

const sampleRoot = path.resolve(__dirname, '..', '..', 'test', 'samples');

function filterSource(src) {
  return String(src).replace('../../../src', 'skatejs');
}

export default function loadSample(sampleName) {
  const filePath = path.join(sampleRoot, sampleName);
  const sourceFile = path.join(filePath, 'index.js');
  if (fs.existsSync(sourceFile)) {
    const source = fs.readFileSync(sourceFile, 'utf8');
    return {
      src: filterSource(source)
    };
  }
  throw new Error(`could not find sample ${sampleName} in ${sampleRoot}`);
}
