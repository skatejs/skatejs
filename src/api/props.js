import { renderer as $renderer } from '../util/symbols';
import assign from '../util/assign';
import keys from '../util/get-all-keys';

function get(elem) {
  const props = {};
  keys(elem.constructor.props).forEach((key) => {
    props[key] = elem[key];
  });

  return props;
}

function set(elem, newProps) {
  assign(elem, newProps);
  if (elem.constructor.render) {
    elem.constructor[$renderer](elem);
  }
}

export default function (elem, newProps) {
  return typeof newProps === 'undefined' ? get(elem) : set(elem, newProps);
}
