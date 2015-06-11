import { EVENT_PREFIX } from '../constants';

export default function (elem, name) {
  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(`${EVENT_PREFIX}${name}`, true, false, undefined);
  elem.dispatchEvent(e);
}
