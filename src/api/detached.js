import apiWatch from './watch';
import utilElementReady from '../util/element-ready';

export default function (elem, name, func) {
  apiWatch(elem, function (added, removed) {
    for (let a = 0; a < removed.length; a++) {
      utilElementReady(removed[a], name, func);
    }
  });
}
