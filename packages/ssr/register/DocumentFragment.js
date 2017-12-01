const { Node } = require('./Node');

const DocumentFragment = class extends Node {
  get nodeName() {
    return '#document-fragment';
  }
};

module.exports = {
  DocumentFragment
};
