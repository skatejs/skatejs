const {
  document,
  DocumentFragment,
  HTMLElement,
  NodeFilter,
  NodeList
} = window;
const { SHOW_ELEMENT } = NodeFilter;
const parser = document.createElement('div');
const _childNodes = Symbol();
const _scopeName = Symbol();
const _scopeExists = Symbol();

function createTreeWalker(root) {
  return document.createTreeWalker(root, SHOW_ELEMENT);
}

function doIfIndex(host, refNode, callback, otherwise) {
  const chren = host.childNodes;
  const index = chren.indexOf(refNode);

  if (index > -1) {
    callback(index, chren);
  } else if (otherwise) {
    otherwise(chren);
  }
}

function makeNodeList(nodeList = []) {
  if (nodeList instanceof NodeList) {
    nodeList = Array.from(nodeList);
  }
  nodeList.item = function(index) {
    return this[index];
  };
  return nodeList;
}

function ensureArray(refNode) {
  return refNode instanceof DocumentFragment
    ? Array.from(refNode.childNodes)
    : [refNode];
}

function reParentOne(refNode, newHost) {
  Object.defineProperty(refNode, 'parentNode', {
    configurable: true,
    value: newHost
  });
  return refNode;
}

function reParentAll(nodeList, newHost) {
  return nodeList.map(n => reParentOne(n, newHost));
}

function getScopeName(host) {
  return (
    host[_scopeName] ||
    (host[_scopeName] =
      'scoped-' +
      Math.random()
        .toString(36)
        .substring(2, 8))
  );
}

export const Shadow = (Base = HTMLElement) =>
  class extends Base {
    get children() {
      return this.childNodes.filter(n => n.nodeType === 1);
    }
    get firstChild() {
      return this.childNodes[0] || null;
    }
    get lastChild() {
      const chs = this.childNodes;
      return chs[chs.length - 1] || null;
    }
    get innerHTML() {
      return this.childNodes.map(n => n.innerHTML || n.textContent).join('');
    }
    set innerHTML(innerHTML) {
      parser.innerHTML = innerHTML;
      this.childNodes = reParentAll(makeNodeList(parser.childNodes), this);
    }
    get outerHTML() {
      const { attributes, localName } = this;
      const attrsAsString = Array.from(attributes).map(
        a => ` ${a.name}="${a.value}"`
      );
      return `<${localName}${attrsAsString}>${this.innerHTML}</${localName}>`;
    }
    set outerHTML(outerHTML) {
      // TODO get attributes and apply to custom element host.
      parser.outerHTML = outerHTML;
      this.childNodes = reParentAll(makeNodeList(parser.childNodes), this);
    }
    get textContent() {
      return this.childNodes.map(n => n.textContent).join('');
    }
    set textContent(textContent) {
      this.childNodes = reParentAll(
        makeNodeList([document.createTextNode(textContent)]),
        this
      );
    }
    appendChild(newNode) {
      this.childNodes = this.childNodes.concat(
        reParentAll(ensureArray(newNode), this)
      );
      return newNode;
    }
    insertBefore(newNode, refNode) {
      newNode = reParentAll(ensureArray(newNode), this);
      doIfIndex(
        this,
        refNode,
        (index, chren) => {
          this.childNodes = chren.concat(
            chren.slice(0, index + 1),
            newNode,
            chren.slice(index)
          );
        },
        chren => {
          this.childNodes = chren.concat(newNode);
        }
      );
      return newNode;
    }
    removeChild(refNode) {
      doIfIndex(this, refNode, (index, chren) => {
        reParentOne(refNode, null);
        this.childNodes = chren.splice(index, 1).concat();
      });
      return refNode;
    }
    replaceChild(newNode, refNode) {
      doIfIndex(this, refNode, (index, chren) => {
        reParentOne(refNode, null);
        this.childNodes = chren.concat(
          chren.slice(0, index),
          reParentAll(ensureArray(newNode)),
          chren.slice(index)
        );
      });
      return refNode;
    }
    attachShadow({ mode }) {
      // Currently we just use an extra element. Working around this involves
      // using a proxy element that modifies the host, but re-parents each node
      // to look like the parent is the shadow root.
      const shadowRoot = document.createElement('shadowroot');

      // Remove existing content and add the shadow root to append to. Appending
      // the shadow root isn't necessary if using the proxy as noted above, but
      // resetting the innerHTML is.
      super.innerHTML = '';
      super.appendChild(shadowRoot);

      // Emulate native { mode }.
      if (mode === 'open') {
        Object.defineProperty(this, 'shadowRoot', { value: shadowRoot });
      }

      return shadowRoot;
    }
  };
