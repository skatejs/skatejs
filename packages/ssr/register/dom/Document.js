const Comment = require('./Comment');
const DocumentFragment = require('./DocumentFragment');
const Element = require('./Element');
const NodeFilter = require('./NodeFilter');
const Text = require('./Text');

const { find, nodeName } = require('../util');

const createElement = document.createElement.bind(document);

class Document extends Element {
  constructor() {
    super();

    this.body = this.createElement('body');
    this.documentElement = this.createElement('html');
    this.head = this.createElement('head');
    this.nodeName = '#document';

    this.appendChild(this.documentElement);
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);

    // Custom configuration options.
    this.ssr = {
      scriptBase: process.cwd()
    };
  }

  createComment(nodeValue = '') {
    const comment = new Comment();
    comment.nodeValue = nodeValue;
    return comment;
  }

  createDocumentFragment() {
    return new DocumentFragment();
  }

  createElement(name) {
    const Ctor = window.customElements.get(name);
    return Ctor ? new Ctor() : createElement(name);
  }

  createEvent(name) {
    return new window[name]();
  }

  createTextNode(nodeValue = '') {
    const text = new Text();
    text.nodeValue = nodeValue;
    return text;
  }

  createTreeWalker(
    root,
    // TODO needs implemeting.
    whatToShow = NodeFilter.SHOW_ALL,
    // TODO needs implemeting.
    filter = { acceptNode: () => NodeFilter.FILTER_ACCEPT }
  ) {
    // Use an array so we don't have to use recursion.
    const stack = [root];
    return {
      currentNode: null,
      nextNode() {
        this.currentNode = stack.shift();
        if (this.currentNode) {
          // We do this in *document order*, so descendents of earlier parents
          // need to get visited first.
          stack.unshift(...this.currentNode.childNodes);
        }
        return this.currentNode || null;
      }
    };
  }

  // TODO use a hash to speed this up.
  getElementById(id) {
    return find(document, node => node.id === id, { one: true });
  }

  getElementsByClassName(className) {
    return find(document, node => node.classList.contains(className));
  }

  getElementsByTagName(tagName) {
    tagName = tagName.toUpperCase();
    return find(document, node => node.nodeName === tagName);
  }

  importNode(node, deep) {
    const { parentNode } = node;
    if (parentNode) {
      parentNode.removeChild(node);
    }
    if (!deep) {
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
    }
    return node;
  }
}

module.exports = Document;
