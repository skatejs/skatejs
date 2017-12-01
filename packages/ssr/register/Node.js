const vm = require('vm');

const { triggerMutation } = require('./MutationObserver');
const { each, execCode, nodeName } = require('./util');

Node.DOCUMENT_FRAGMENT_NODE = 11;
Node.ELEMENT_NODE = 1;
Node.TEXT_NODE = 3;

const isConnected = Symbol('isConnected');
const NodeProto = Node.prototype;
const { insertBefore, removeChild } = NodeProto;

function connectNode(node) {
  if (node.connectedCallback && !node[isConnected]) {
    node.connectedCallback();
  }
  node[isConnected] = true;
  triggerMutation('add', node);
}

function disconnectNode(node) {
  if (node.disconnectedCallback && node[isConnected]) {
    node.disconnectedCallback();
  }
  node[isConnected] = false;
  triggerMutation('remove', node);
}

Object.defineProperty(NodeProto, 'content', {
  get() {
    if (!this._content) {
      this._content = new DocumentFragment();
      this.childNodes.forEach(node => this._content.appendChild(node));
    }
    return this._content;
  }
});

Object.defineProperty(NodeProto, 'ownerDocument', {
  get() {
    return document;
  }
});

Object.defineProperty(NodeProto, 'nodeType', {
  get() {
    if (this instanceof Element) {
      return 1;
    }
    if (this instanceof Text) {
      return 3;
    }
    if (this instanceof DocumentFragment) {
      return 11;
    }
  }
});

Object.defineProperty(NodeProto, 'textContent', {
  get() {
    return this.childNodes.map(c => c.nodeValue).join('');
  },
  set(val) {
    this.appendChild(document.createTextNode(val));
    if (this.nodeName === 'SCRIPT') {
      execCode(val);
    }
  }
});

NodeProto.contains = function(node) {
  if (this === node) {
    return true;
  }
  for (let childNode of this.childNodes) {
    if (childNode.contains(node)) {
      return true;
    }
  }
  return false;
};

NodeProto.hasChildNodes = function() {
  return this.childNodes.length;
};

// Undom internally calls insertBefore in appendChild.
NodeProto.insertBefore = function(newNode, refNode) {
  return each(newNode, newNode => {
    insertBefore.call(this, newNode, refNode);
    connectNode(newNode);
  });
};

// Undom internally calls removeChild in replaceChild.
NodeProto.removeChild = function(refNode) {
  return each(refNode, refNode => {
    disconnectNode(refNode, this);
    removeChild.call(this, refNode);
  });
};

module.exports = {
  Node
};
