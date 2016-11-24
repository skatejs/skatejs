import { renderer as $renderer } from '../util/symbols';
import assign from '../util/assign';
import getPropConfigs from '../util/get-prop-configs';
import keys from '../util/get-all-keys';

function get (elem) {
  const props = {};
  keys(getPropConfigs(elem.constructor)).forEach((key) => {
    props[key] = elem[key];
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
