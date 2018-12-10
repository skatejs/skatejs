class MutationRecord {
  constructor() {
    this.addedNodes = [];
    this.attributeName = null;
    this.attributeNamespace = null;
    this.oldValue = null;
    this.nextSibling = null;
    this.previousSibling = null;
    this.removedNodes = [];
    this.target = null;
    this.type = null;
  }
}

module.exports = MutationRecord;
