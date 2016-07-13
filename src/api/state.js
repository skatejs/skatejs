import { $renderer } from '../util/symbols';
import assign from '../util/assign';

function get (elem) {
  const props = elem.constructor.props;
  const state = {};
  for (let key in props) {
    const val = elem[key];
    if (typeof val !== 'undefined') {
      state[key] = val;
    }
  }
  return state;
}

function set (elem, newState) {
  assign(elem, newState);
  if (elem.constructor.render) {
    elem.constructor[$renderer](elem);
  }
}

export default function (elem, newState) {
  return typeof newState === 'undefined' ? get(elem) : set(elem, newState);
}
