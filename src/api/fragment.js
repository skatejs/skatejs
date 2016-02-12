import init from './init';
import utilCreateElement from '../util/create-element';
import utilCreateDocumentFragment from '../util/create-document-fragment';

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
  const container = utilCreateElement('div');
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

    if (node) {
      frag.appendChild(node);
    }

    return frag;
  }, utilCreateDocumentFragment());
}
