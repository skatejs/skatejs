import assign from '../util/assign';
import init from './init';
import registry from '../polyfill/registry';

var specialMap = {
  caption: 'table',
  dd: 'dl',
  dt: 'dl',
  li: 'ul',
  tbody: 'table',
  td: 'tr',
  thead: 'table',
  tr: 'tbody'
};

function matchTag (dom) {
  var tag = dom.match(/\s*<([^\s>]+)/);
  return tag && tag[1] || 'div';
}

function resolveCorrectTagParents (tag) {
  var mapped;
  var parent = document.createElement(tag);

  while (mapped = specialMap[parent.tagName.toLowerCase()]) {
    let tempParent = document.createElement(mapped);
    tempParent.appendChild(parent);
    parent = tempParent;
  }

  return parent;
}

function createFromHtml (html) {
  var par = resolveCorrectTagParents(matchTag(html));
  par.innerHTML = html;
  return init(par.firstElementChild);
}

function createFromName (name) {
  var ctor = registry.get(name);
  return ctor && ctor() || document.createElement(name);
}

export default function (name, props) {
  name = name.trim();
  return assign(name[0] === '<' ? createFromHtml(name) : createFromName(name), props);
}
