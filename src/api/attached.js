import apiReady from './ready';
import apiWatch from './watch';
import utilElementReady from '../util/element-ready';

export default function (elem, name, func) {
  apiReady(elem, name, func);
  apiWatch(elem, function (added) {
    for (let a = 0; a < added.length; a++) {
      utilElementReady(added[a], name, func);
    }
  });
}
