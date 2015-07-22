import apiReady from './ready';
import apiWatch from './watch';
import utilData from '../util/data';

const EVENT_READY = '_skate-ready';

export default function (elem, name, func) {
  apiReady(elem, name, func);
  apiWatch(elem, function (added) {
    for (let a = 0; a < added.length; a++) {
      let desc = added[a];

      if (utilData(desc, name).created) {
        func(desc);
      } else {
        desc.addEventListener(EVENT_READY, eventHandler);
      }
    }
  });
}
