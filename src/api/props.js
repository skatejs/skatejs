import { renderer as $renderer } from '../util/symbols';
import assign from '../util/assign';
import getPropNamesAndSymbols from '../util/get-prop-names-and-symbols';
import getPropsMap from '../util/get-props-map';
import { isUndefined } from '../util/is-type';

function get (elem) {
  const props = {};

  getPropNamesAndSymbols(getPropsMap(elem.constructor)).forEach((nameOrSymbol) => {
    props[nameOrSymbol] = elem[nameOrSymbol];
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
  return isUndefined(newProps) ? get(elem) : set(elem, newProps);
}
