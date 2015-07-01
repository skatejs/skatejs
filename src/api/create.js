import assign from '../util/assign';
import init from './init';
import registry from '../global/registry';

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
  return tag && tag[1];
}

function createFromHtml (html) {
  var par = document.createElement(specialMap[matchTag(html)] || 'div');
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
