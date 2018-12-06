const Node = require('./Node');

const Comment = class extends Node {
  constructor() {
    super();
    this._nodeValue = '';
  }
  get nodeName() {
    return '#comment';
  }
  get nodeType() {
    return Node.COMMENT_NODE;
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

module.exports = Comment;
