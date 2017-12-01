const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { parseFragment } = require('parse5');

const { execFile, nodeName, prop } = require('./util');
const { ClassList } = require('./ClassList');
const { CSSStyleSheet } = require('./StyleSheet');
const { triggerMutation } = require('./MutationObserver');

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
  const { attrs, childNodes, nodeName, value } = parsed;

  if (nodeName === '#document-fragment') {
    node = document.createDocumentFragment();
  } else if (nodeName === '#text') {
    node = document.createTextNode(value);
  } else {
    node = document.createElement(nodeName);
    attrs.forEach(({ name, value }) => node.setAttribute(name, value));
  }

  if (childNodes) {
    childNodes.forEach(c => node.appendChild(translateParsed(c)));
  }

  return node;
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
  triggerMutation('attribute', this, name, oldValue);
  if (this.attributeChangedCallback) {
    this.attributeChangedCallback(name, oldValue, null);
  }
};

ElementProto.setAttribute = function(name, newValue) {
  if (settingProp) return;
  const oldValue = this.getAttribute(name);
  const propName = attrToPropMap[name];
  setAttribute.call(this, name, newValue);
  if (propName) {
    settingProp = true;
    this[propName] = newValue;
    settingProp = false;
  }
  triggerMutation('attribute', this, name, oldValue);
  if (this.attributeChangedCallback) {
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
    return this.childNodes.map(c => c.outerHTML || c.textContent).join('');
  },
  set(val) {
    if (this.nodeName === 'SCRIPT') {
      return (this.textContent = val);
    }
    while (this.hasChildNodes()) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(translateParsed(parseFragment(val)));
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
  }
});

prop(ElementProto, 'nodeName', {
  get() {
    return this._nodeName || customElements.__fixLostNodeNameForElement(this);
  },
  set(val) {
    this._nodeName = val;
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

module.exports = {
  Element
};
