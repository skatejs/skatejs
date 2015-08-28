import assign from '../util/assign';
import createFromHtml from '../util/create-from-html';
import init from './init';
import registry from '../global/registry';

function createFromName (name) {
  var ctor = registry.get(name);
  return ctor && ctor() || document.createElement(name);
}

export default function (name, props) {
  name = name.trim();
  return assign(name[0] === '<' ? init(createFromHtml(name).firstElementChild) : createFromName(name), props);
}
