const { Comment } = require('./Comment');
const { DocumentFragment } = require('./DocumentFragment');
const { NodeFilter } = require('./NodeFilter');
const { find, nodeName } = require('./util');

const createElement = document.createElement.bind(document);

document.defaultView = window;

document.createComment = function(textContent) {
  const comment = new Comment();
  comment.textContent = textContent;
  return comment;
};

document.createDocumentFragment = () => new DocumentFragment();

document.createElement = function(name) {
  const Ctor = window.customElements.get(name);
  return Ctor ? new Ctor() : createElement(name);
};

document.createEvent = function(name) {
  return new window[name]();
};

document.createTreeWalker = function(
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
};

// TODO use a hash to speed this up.
document.getElementById = function(id) {
  return find(document, node => node.id === id, { one: true });
};

document.getElementsByClassName = function(className) {
  return find(document, node => node.classList.contains(className));
};

document.getElementsByTagName = function(tagName) {
  tagName = tagName.toUpperCase();
  return find(document, node => node.nodeName === tagName);
};

document.importNode = function(node, deep) {
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
};

document.head = document.createElement('head');
document.documentElement = document.createElement('html');
document.appendChild(document.documentElement);
document.documentElement.appendChild(document.head);
document.documentElement.appendChild(document.body);

// Custom configuration options.
document.ssr = {
  scriptBase: process.cwd()
};
