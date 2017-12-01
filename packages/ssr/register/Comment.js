const { Node } = require('./Node');

const Comment = class extends Node {
  get outerHTML() {
    return `<!--${this.textContent}-->`;
  }
  get innerHTML() {
    return this.textContent;
  }
};

module.exports = {
  Comment
};
