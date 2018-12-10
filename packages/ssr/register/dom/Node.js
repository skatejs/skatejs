const vm = require('vm');
const MutationObserver = require('./MutationObserver');
const { each, execCode, nodeName, prop } = require('../util');

const nodeTypes = {
  COMMENT_NODE: 8,
  DOCUMENT_FRAGMENT_NODE: 11,
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};
const isConnected = Symbol('isConnected');
const NodeProto = Node.prototype;
const { insertBefore, removeChild } = NodeProto;

// Properties we need to patch.
const firstChild = Object.getOwnPropertyDescriptor(NodeProto, 'firstChild');
const lastChild = Object.getOwnPropertyDescriptor(NodeProto, 'lastChild');
const nextSibling = Object.getOwnPropertyDescriptor(NodeProto, 'nextSibling');
const prevSibling = Object.getOwnPropertyDescriptor(
  NodeProto,
  'previousSibling'
);

function connectNode(node) {
  if (node[isConnected]) {
    return;
  }
  if (node.connectedCallback) {
    node.connectedCallback();
  }
  node[isConnected] = true;
  MutationObserver.trigger('add', node);
}

function disconnectNode(node) {
  if (!node[isConnected]) {
    return;
  }
  if (node.disconnectedCallback) {
    node.disconnectedCallback();
  }
  node[isConnected] = false;
  MutationObserver.trigger('remove', node);
}

// Copy node type constants over to both statics and the prototype.
for (const key in nodeTypes) {
  Node[key] = NodeProto[key] = nodeTypes[key];
}

prop(NodeProto, 'content', {
  get() {
    if (!this._content) {
      this._content = new DocumentFragment();
      this.childNodes.forEach(node => {
        node = node.cloneNode(true);
        node.parentNode = this._content;
        this._content.childNodes.push(node);
      });
    }
    return this._content;
  }
});

prop(NodeProto, 'firstChild', {
  get() {
    return firstChild.get.call(this) || null;
  }
});

prop(NodeProto, 'lastChild', {
  get() {
    return lastChild.get.call(this) || null;
  }
});

prop(NodeProto, 'nextSibling', {
  get() {
    return nextSibling.get.call(this) || null;
  }
});

prop(NodeProto, 'ownerDocument', {
  get() {
    return document;
  }
});

prop(NodeProto, 'previousSibling', {
  get() {
    return prevSibling.get.call(this) || null;
  }
});

prop(NodeProto, 'textContent', {
  get() {
    return this.childNodes.map(c => c.nodeValue).join('');
  },
  set(val) {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(document.createTextNode(val));
    if (this.nodeName === 'SCRIPT') {
      execCode(val);
    }
  }
});

NodeProto.cloneNode = function(deep) {
  let clone;
  switch (this.nodeType) {
    case Node.COMMENT_NODE:
      clone = document.createComment(this.textContent);
      break;
    case Node.DOCUMENT_FRAGMENT_NODE:
      clone = document.createDocumentFragment();
      break;
    case Node.ELEMENT_NODE:
      clone = document.createElement(this.nodeName);
      clone.attributes = this.attributes.slice();
      break;
    case Node.TEXT_NODE:
      clone = document.createTextNode(this.textContent);
      break;
  }

  if (!deep) {
    return clone;
  }

  for (let childNode of this.childNodes) {
    clone.childNodes.push(childNode.cloneNode(true));
  }

  return clone;
};

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

module.exports = Node;
