import assign from '../util/assign';
import createParentElement from '../util/create-parent-element';
import init from './init';
import registry from '../global/registry';

function createFromHtml (html) {
  var par = createParentElement(html);
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
