import globalRegistry from '../global/registry';
import utilData from '../util/data';

const EVENT_READY = '_skate-ready';
const EVENT_REGISTER = '_skate-register';

function whenRegistered (name, func) {
  var definition = globalRegistry.get(name);
  if (definition) {
    func(definition);
  } else {
    document.addEventListener(EVENT_REGISTER, function handleRegister (e) {
      if (e.detail.id === name) {
        func(e.detail);
        document.removeEventListener(EVENT_REGISTER, handleRegister);
      }
    });
  }
}

export default function (elem, name, func) {
  function eventHandler (e) {
    if (e.detail.id === name) {
      func(e.target);
      e.target.removeEventListener(eventHandler);
    }
  }

  whenRegistered(name, function (definition) {
    var items = elem.querySelectorAll(definition.type.selector(definition)) || [];
    var itemsLen = items.length;

    for (let a = 0; a < itemsLen; a++) {
      let desc = items[a];

      if (utilData(desc, name).created) {
        func(desc);
      } else {
        desc.addEventListener(EVENT_READY, eventHandler);
      }
    }
  });
}
