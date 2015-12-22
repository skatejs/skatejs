import init from './init';

const { Node, NodeList } = window;
const slice = Array.prototype.slice;
const specialMap = {
  caption: 'table',
  dd: 'dl',
  dt: 'dl',
  li: 'ul',
  tbody: 'table',
  td: 'tr',
  thead: 'table',
  tr: 'tbody'
};

function resolveParent (tag, html) {
  const container = document.createElement('div');
  let levels = 0;
  let parentTag = specialMap[tag];

  while (parentTag) {
    html = `<${parentTag}>${html}</${parentTag}>`;
    ++levels;
    parentTag = specialMap[parentTag];
  }

  container.innerHTML = html;

  let parent = container;
  for (let a = 0; a < levels; a++) {
    parent = parent.firstElementChild;
  }
  return parent;
}

function resolveTag (html) {
  const tag = html.match(/^<([^\s>]+)/);
  return tag && tag[1];
}

function resolveHtml (html) {
  return resolveParent(resolveTag(html), html);
}

export default function fragment (...args) {
  return args.reduce(function (frag, node) {
    if (typeof node === 'string') {
      node = fragment.apply(null, slice.call(resolveHtml(node).childNodes));
    } else if (node instanceof NodeList || Array.isArray(node)) {
      node = fragment.apply(null, slice.call(node));
    } else if (node instanceof Node) {
      init(node);
    }

    if (node instanceof Node) {
      frag.appendChild(node);
    }

    return frag;
  }, document.createDocumentFragment());
}




import data from '../../util/data';
import fragment from '../fragment';

function normalize (node) {
  return node instanceof DocumentFragment ? [].slice.call(node.childNodes) : [node];
}

function mutate (elem, type, args) {
  const desc = data(elem).contentPropertyProjectee;
  desc && desc[type].apply(desc, args);
}

function update (elem, change) {
  return function (type, args) {
    mutate(elem, type, args);
    change && change(elem, type, args);
  };
}

function createDomArray (elem, update) {
  const childNodes = [];

  return {
    get childNodes () {
      return childNodes;
    },
    appendChild (newNode) {
      childNodes.push.apply(childNodes, normalize(newNode));
      update('appendChild', [newNode]);
      return newNode;
    },
    insertBefore (newNode, referenceNode) {
      childNodes.splice.apply(null, [childNodes.indexOf(referenceNode), 0].concat(normalize(newNode)));
      update('insertBefore', [newNode, referenceNode]);
      return newNode;
    },
    removeChild (oldNode) {
      normalize(oldNode).forEach(function (oldNode) {
        childNodes.splice(childNodes.indexOf(oldNode), 1);
      });
      update('removeChild', [oldNode]);
      return oldNode;
    },
    replaceChild (newNode, oldNode) {
      childNodes.splice.apply(null, [childNodes.indexOf(oldNode), 1].concat(normalize(newNode)));
      update('replaceChild', [newNode, oldNode]);
      return oldNode;
    }
  };
}

export default {
  created (elem) {
    const eldata = data(elem);
    eldata.contentProperty = createDomArray(elem, update(elem, this.change));
    eldata.contentPropertyInitialState = [].slice.call(elem.childNodes);
    eldata.contentPropertyProjectee = this.selector ? elem.querySelector(this.selector) : null;
  },
  get (elem) {
    return data(elem).contentProperty;
  },
  ready (elem) {
    const eldata = data(elem);
    eldata.contentProperty.appendChild(fragment(eldata.contentPropertyInitialState));
    delete eldata.contentPropertyInitialState;
  },
  set (elem, change) {
    const eldata = data(elem);
    eldata.contentProperty.appendChild(fragment(change.newValue));
  }
};

