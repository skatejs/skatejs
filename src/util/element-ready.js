import utilData from '../util/data';

const EVENT_READY = '_skate-ready';

export default function (elem, name, func) {
  function eventHandler (e) {
    if (e.detail.id === name) {
      func(e.target);
      e.target.removeEventListener(eventHandler);
    }
  }

  if (utilData(elem, name).created) {
    func(elem);
  } else {
    elem.addEventListener(EVENT_READY, eventHandler);
  }
}
