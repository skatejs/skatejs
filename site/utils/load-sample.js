const fs = require('fs');
const path = require('path');

const sampleRoot = path.resolve(__dirname, '..', '..', 'test', 'samples');

function filterSource(src) {
    return String(src).replace('../../../src', 'skatejs');
}

export default function loadSample(sampleName) {
    let filePath = path.join(sampleRoot, sampleName);
    let sourceFile = path.join(filePath, 'index.js');
    if (fs.existsSync(sourceFile)) {
        let source = fs.readFileSync(sourceFile, 'utf8');
        let html = fs.readFileSync(path.join(filePath, 'index.html.js'), 'utf8');
        let result = fs.readFileSync(path.join(filePath, 'index.result.js'), 'utf8');
        return {
            source: filterSource(source),
            html,
            result
        };
    }
    throw new Error(`could not find sample ${sampleName} in ${sampleRoot}`);
}
