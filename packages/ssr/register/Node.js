const vm = require('vm');

const { triggerMutation } = require('./MutationObserver');
const { each, execCode, nodeName, prop } = require('./util');

Node.DOCUMENT_FRAGMENT_NODE = 11;
Node.ELEMENT_NODE = 1;
Node.TEXT_NODE = 3;

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
  if (node.connectedCallback && !node[isConnected]) {
    node.connectedCallback();
  }
  node[isConnected] = true;
  triggerMutation('add', node.parentNode);
}

function disconnectNode(node) {
  if (node.disconnectedCallback && node[isConnected]) {
    node.disconnectedCallback();
  }
  node[isConnected] = false;
  triggerMutation('remove', node.parentNode);
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

prop(NodeProto, 'nodeType', {
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
    case Node.ELEMENT_NODE:
      clone = document.createElement(this.nodeName);
      clone.attributes = this.attributes.slice();
      break;
    case Node.DOCUMENT_FRAGMENT_NODE:
      clone = document.createDocumentFragment();
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

  clone.innerText = this.innerText;

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

module.exports = {
  Node
};
