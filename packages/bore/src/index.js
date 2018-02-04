const { DocumentFragment, Node, Promise } = window;
const { slice } = [];
const { customElements, HTMLElement } = window;
const { body } = document;
const { attachShadow } = HTMLElement.prototype;
const { diff } = require('skatejs-dom-diff').default;

// Ensure we can force sync operations in the polyfill.
if (customElements) {
  customElements.enableFlush = true;
}

// Create and add a fixture to append nodes to.
const fixture = document.createElement('div');
document.body.appendChild(fixture);

// Override to force mode "open" so we can query against all shadow roots.
HTMLElement.prototype.attachShadow = function() {
  return attachShadow.call(this, { mode: 'open' });
};

// Ensures polyfill operations are run sync.
function flush() {
  if (customElements && typeof customElements.flush === 'function') {
    customElements.flush();
  }
}

// Abstraction for:
//
// 1. Native
// 2. Non-compliant browers
// 3. JSDOM or environments that only implement querySelector
function matches(node, query) {
  return (node.matches =
    node.matchesSelector ||
    node.mozMatchesSelector ||
    node.msMatchesSelector ||
    node.oMatchesSelector ||
    node.webkitMatchesSelector ||
    function(s) {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s);
      let i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    }).call(node, query);
}

function getInstantiatedNodeWithinFixture(node, isRootNode) {
  const isStringNode = typeof node === 'string';

  // If the fixture has been removed from the document, re-insert it.
  if (!body.contains(fixture)) {
    body.appendChild(fixture);
  }

  if (isRootNode) {
    setFixtureContent(node, isStringNode);
  }

  return isStringNode ? fixture.children[0] : node;
}

function setFixtureContent(node, shouldSetChildrenViaString) {
  // If this is a new node, clean up the fixture.
  fixture.innerHTML = '';

  // Add the node to the fixture so it runs the connectedCallback().
  shouldSetChildrenViaString
    ? (fixture.innerHTML = node)
    : fixture.appendChild(node);
}

class Wrapper {
  constructor(node, opts = {}) {
    const isRootNode = !node.parentNode;

    this.opts = opts;
    this.node = getInstantiatedNodeWithinFixture(node, isRootNode);

    if (customElements && isRootNode) {
      const customElementDefinition = customElements.get(this.node.localName);
      customElementDefinition && flush();
    }
  }

  get shadowRoot() {
    const { node } = this;
    return node.shadowRoot || node;
  }

  all(query) {
    const { shadowRoot } = this;
    const type = typeof query;
    let temp = [];

    if (query.nodeType === Node.ELEMENT_NODE) {
      walkTree(
        shadowRoot,
        node =>
          diff({ destination: query, source: node, root: true }).length === 0 &&
          temp.push(node)
      );
    } else if (query.prototype instanceof HTMLElement) {
      walkTree(shadowRoot, node => node instanceof query && temp.push(node));
    } else if (type === 'function') {
      walkTree(shadowRoot, node => query(node) && temp.push(node));
    } else if (type === 'object') {
      const keys = Object.keys(query);
      if (keys.length === 0) {
        return temp;
      }
      walkTree(
        shadowRoot,
        node => keys.every(key => node[key] === query[key]) && temp.push(node)
      );
    } else if (type === 'string') {
      walkTree(shadowRoot, node => {
        if (matches(node, query)) {
          temp.push(node);
        }
      });
    }

    return temp.map(n => new Wrapper(n, this.opts));
  }

  has(query) {
    return !!this.one(query);
  }

  one(query) {
    return this.all(query)[0];
  }

  wait(func) {
    return this.waitFor(wrap => !!wrap.node.shadowRoot).then(func);
  }

  waitFor(func, { delay } = { delay: 1 }) {
    return new Promise((resolve, reject) => {
      const check = () => {
        const ret = (() => {
          try {
            return func(this);
          } catch (e) {
            reject(e);
          }
        })();
        if (ret) {
          resolve(this);
        } else {
          setTimeout(check, delay);
        }
      };
      setTimeout(check, delay);
    }).catch(e => {
      throw e;
    });
  }
}

function mount(elem) {
  return new Wrapper(elem);
}

function walk(elem, call) {
  call(elem);
  return walkTree(elem, call);
}

function walkTree({ childNodes }, call) {
  for (const node of childNodes) {
    if (walk(node, call) === false) {
      return false;
    }
  }
}

module.exports.mount = mount;
