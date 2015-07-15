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

function fixIeNotAllowingInnerHTMLOnTableElements (tag, html) {
  var target = document.createElement('div');
  var levels = 0;

  while (tag) {
    html = `<${tag}>${html}</${tag}>`;
    tag = specialMap[tag];
    ++levels;
  }

  target.innerHTML = html;
  for (let a = 0; a <= levels; a++) {
    target = target.firstElementChild;
  }

  return target;
}

function matchTag (dom) {
  var tag = dom.match(/\s*<([^\s>]+)/);
  return tag && tag[1];
}

function createFromHtml (html) {
  var tag = specialMap[matchTag(html)];
  var par = document.createElement(tag || 'div');
  par.innerHTML = html;
  return init(par.firstElementChild || fixIeNotAllowingInnerHTMLOnTableElements(tag, html));
}

function createFromName (name) {
  var ctor = registry.get(name);
  return ctor && ctor() || document.createElement(name);
}

export default function (name, props) {
  name = name.trim();
  return assign(name[0] === '<' ? createFromHtml(name) : createFromName(name), props);
}
