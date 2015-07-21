import globalRegistry from '../global/registry';
import utilData from '../util/data';

const EVENT = '_skate-ready';

function query (elem, name) {
  var definition = globalRegistry.get(name);
  return definition && elem.querySelectorAll(`${definition.type.selector(definition)}`) || [];
}

export default function (elem, name, func) {
  function eventHandler (e) {
    if (e.detail.id === name) {
      func.call(e.target);
      e.target.removeEventListener(eventHandler);
    }
  }

  var items = query(elem, name);
  var itemsLen = items.length;

  for (let a = 0; a < itemsLen; a++) {
    let desc = items[a];
    if (utilData(desc, name).created) {
      func.call(desc);
    } else {
      desc.addEventListener(EVENT, eventHandler);
    }
  }
}
