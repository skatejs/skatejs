import { renderer as $renderer } from '../util/symbols';
import assign from '../util/assign';

function get (elem) {
  const state = {};
  for (let key in elem.constructor.props) {
    state[key] = elem[key];
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
