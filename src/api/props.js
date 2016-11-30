import { renderer as $renderer } from '../util/symbols';
import assign from '../util/assign';
import getPropsMap from '../util/get-props-map';
import getAllKeys from '../util/get-all-keys';

function get (elem) {
  const props = {};

  getAllKeys(getPropsMap(elem.constructor)).forEach((propNameOrSymbol) => {
    props[propNameOrSymbol] = elem[propNameOrSymbol];
  });

  return props;
}

function set (elem, newProps) {
  assign(elem, newProps);
  if (elem[$renderer]) {
    elem[$renderer]();
  }
}

export default function (elem, newProps) {
  return typeof newProps === 'undefined' ? get(elem) : set(elem, newProps);
}
