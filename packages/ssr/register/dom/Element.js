const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { parseFragment } = require('parse5');

const ClassList = require('./ClassList');
const Node = require('./Node');
const MutationObserver = require('./MutationObserver');
const CSSStyleSheet = require('./StyleSheet');

const { execFile, nodeName, prop } = require('../util');

const ElementProto = Element.prototype;
const {
  dispatchEvent,
  getAttribute,
  removeAttribute,
  setAttribute
} = ElementProto;

let settingProp = false;
const attrToPropMap = {
  class: 'className',
  id: 'id',
  src: 'src',
  type: 'type'
};

function translateParsed(parsed) {
  let node;
  const { attrs, childNodes, data, nodeName, value } = parsed;

  // Parse5 doesn't give nodeType, so we have to use the node name.
  if (nodeName === '#comment') {
    node = document.createComment(data);
  } else if (nodeName === '#document-fragment') {
    node = document.createDocumentFragment();
  } else if (nodeName === '#text') {
    node = document.createTextNode(value);
  } else {
    node = document.createElement(nodeName);
    if (attrs) {
      attrs.forEach(({ name, value }) => node.setAttribute(name, value));
    }
  }

  if (childNodes) {
    childNodes.forEach(c => node.appendChild(translateParsed(c)));
  }

  return node;
}

// Copy inherited stuff from Node statics.
for (const key in Node) {
  Element[key] = Node[key];
}

ElementProto.dispatchEvent = function(evnt) {
  evnt.target = this;
  return dispatchEvent.call(this, evnt);
};

ElementProto.getAttribute = function(name) {
  const value = getAttribute.call(this, name);
  return value == null ? null : value;
};

ElementProto.hasAttribute = function(name) {
  return this.getAttribute(name) !== null;
};

ElementProto.hasAttributes = function() {
  return !!this.attributes.length;
};

ElementProto.removeAttribute = function(name) {
  const oldValue = this.getAttribute(name);
  removeAttribute.call(this, name);
  MutationObserver.trigger('attribute', this, name, oldValue);
  if (this.attributeChangedCallback) {
    this.attributeChangedCallback(name, oldValue, null);
  }
};

ElementProto.setAttribute = function(name, newValue) {
  if (settingProp) return;
  const observedAttributes = this.constructor.observedAttributes || [];
  const oldValue = this.getAttribute(name);
  const propName = attrToPropMap[name];
  setAttribute.call(this, name, newValue);
  if (propName) {
    settingProp = true;
    this[propName] = newValue;
    settingProp = false;
  }
  MutationObserver.trigger('attribute', this, name, oldValue);
  if (this.attributeChangedCallback && observedAttributes.indexOf(name) > -1) {
    this.attributeChangedCallback(name, oldValue, newValue);
  }
};

ElementProto.assignedNodes = function() {
  if (this.nodeName !== 'SLOT') {
    throw new Error(
      'Non-standard: assignedNodes() called on non-slot element.'
    );
  }

  const name = this.getAttribute('name') || this.name;

  let node = this,
    host;
  while ((node = node.parentNode)) {
    if (node.host) {
      host = node.host;
      break;
    }
  }

  return host
    ? host.childNodes.filter(n => {
        return name
          ? n.getAttribute && n.getAttribute('slot') === name
          : !n.getAttribute || !n.getAttribute('slot');
      })
    : [];
};

// This really should go on HTMLElement, however, all nodes created by Undom
// derive from Element.
ElementProto.attachShadow = function({ mode, test }) {
  // We use an element to denote this. This is proposed to be the element that
  // will be used as the declarative form for Shadow DOM. This is subject to
  // change.
  const host = this;
  const shadowRoot = document.createElement('shadowroot');

  if (this.__hasShadowRoot) {
    throw new Error(
      'Failed to execute "attachShadow" on "Element": Shadow root cannot be created on a host which already hosts a shadow tree.'
    );
  }

  // This is so we can check for multiple invocations.
  this.__hasShadowRoot = true;

  prop(shadowRoot, 'host', {
    get() {
      return host;
    }
  });

  prop(shadowRoot, 'mode', {
    get() {
      return mode;
    }
  });

  if (mode === 'open') {
    prop(this, 'shadowRoot', {
      get() {
        return shadowRoot;
      }
    });
  }

  return shadowRoot;
};

prop(ElementProto, 'classList', {
  get() {
    return new ClassList(this);
  }
});

prop(ElementProto, 'className', {
  get() {
    return this.getAttribute('class');
  },
  set(val) {
    this.setAttribute('class', val);
  }
});

prop(ElementProto, 'innerHTML', {
  get() {
    return this.childNodes
      .map(c => {
        return c.nodeType === Node.COMMENT_NODE
          ? `<!--${c.textContent}-->`
          : c.outerHTML || c.textContent;
      })
      .join('');
  },
  set(val) {
    if (this.nodeName === 'SCRIPT') {
      return (this.textContent = val);
    }
    while (this.hasChildNodes()) {
      this.removeChild(this.firstChild);
    }
    if (val) {
      this.appendChild(translateParsed(parseFragment(val)));
    }
  }
});

prop(ElementProto, 'localName', {
  get() {
    return (this.nodeName || '').toLowerCase();
  }
});

prop(ElementProto, 'nextElementSibling', {
  get() {
    let sib = this;
    while ((sib = sib.nextSibling)) {
      if (sib.nodeType === 1) {
        return sib;
      }
    }
    return null;
  }
});

prop(ElementProto, 'nodeName', {
  get() {
    return this._nodeName || customElements.__fixLostNodeNameForElement(this);
  },

  // TODO check to see if this is necessary anymore. This shouldn't be settable.
  set(val) {
    this._nodeName = val;
  }
});

prop(ElementProto, 'nodeType', {
  get() {
    return Node.ELEMENT_NODE;
  }
});

prop(ElementProto, 'nodeValue', {
  get() {
    return null;
  }
});

prop(ElementProto, 'onload', {
  get() {
    return this._onload;
  },
  set(val) {
    this._onload = val;
    if (!this._loaded && this._onload && this._src) {
      this._loaded = true;
      this._onload();
    }
  }
});

prop(ElementProto, 'outerHTML', {
  get() {
    const { localName } = this;
    if (localName === '#comment') {
      return `<!--${this.innerHTML}-->`;
    }
    return `<${localName}${this.attributes.reduce(
      (prev, { name, value }) => prev + ` ${name}="${value}"`,
      ''
    )}>${this.innerHTML}</${localName}>`;
  },
  set(val) {
    throw new Error('Not implemented: set outerHTML');
  }
});

prop(ElementProto, 'previousElementSibling', {
  get() {
    let sib = this;
    while ((sib = sib.previousSibling)) {
      if (sib.nodeType === 1) {
        return sib;
      }
    }
    return null;
  }
});

prop(ElementProto, 'sheet', {
  get() {
    if (this.nodeName === 'STYLE') {
      return this._sheet || (this._sheet = new CSSStyleSheet(this));
    }
  }
});

prop(ElementProto, 'src', {
  get() {
    return this._src;
  },
  set(val) {
    this.setAttribute('src', val);

    this._loaded = false;
    this._src = val;

    if (
      this.nodeName === 'SCRIPT' &&
      (!this.type || this.type === 'text/javascript')
    ) {
      execFile(val);
    }

    if (!this._loaded && this._onload) {
      this._loaded = true;
      this._onload();
    }
  }
});

prop(ElementProto, 'tagName', {
  get() {
    return this.nodeName;
  }
});

prop(ElementProto, 'textContent', {
  get() {
    return this.childNodes.map(c => c.textContent).join('');
  },
  set(textContent) {
    while (this.hasChildNodes()) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(document.createTextNode(textContent));
  }
});

module.exports = Element;
