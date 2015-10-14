import init from './init';

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

function matchTag (html) {
  const tag = html.match(/^<([^\s>]+)/);
  return tag && tag[1];
}

function buildFragment (frag, arg) {
  if (arg) {
    if (typeof arg === 'string') {
      arg = arg.trim();
      if (arg[0] === '<') {
        arg = resolveParent(matchTag(arg), arg).childNodes;
        arg = fragment.apply(null, slice.call(arg));
      } else {
        arg = document.createTextNode(arg);
      }
    } else if (arg.length) {
      arg = fragment.apply(null, slice.call(arg));
    } else if (arg.nodeType) {
      init(arg);
    }
    frag.appendChild(arg);
  }
  return frag;
}

export default function fragment (...args) {
  return args.reduce(buildFragment, document.createDocumentFragment());
}
