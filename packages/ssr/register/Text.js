const { Node } = require('./Node');

const Text = class extends Node {
  constructor() {
    super();
    this._nodeValue = '';
  }
  get nodeName() {
    return '#text';
  }
  get nodeType() {
    return Node.TEXT_NODE;
  }
  get nodeValue() {
    return this._nodeValue;
  }
  set nodeValue(nodeValue) {
    this._nodeValue = nodeValue;
  }
  get textContent() {
    return this.nodeValue;
  }
  set textContent(textContent) {
    this.nodeValue = textContent;
  }
};

module.exports = {
  Text
};
