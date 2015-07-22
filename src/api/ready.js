import globalRegistry from '../global/registry';
import utilElementReady from '../util/element-ready';

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
  whenRegistered(name, function (definition) {
    var items = elem.querySelectorAll(definition.type.selector(definition)) || [];
    var itemsLen = items.length;

    for (let a = 0; a < itemsLen; a++) {
      utilElementReady(items[a], name, func);
    }
  });
}
