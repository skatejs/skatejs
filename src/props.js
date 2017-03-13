import assign from './util/assign';
import getPropNamesAndSymbols from './util/get-prop-names-and-symbols';
import getPropsMap from './util/get-props-map';

function get (elem) {
  const props = {};

  getPropNamesAndSymbols(getPropsMap(elem.constructor)).forEach((nameOrSymbol) => {
    props[nameOrSymbol] = elem[nameOrSymbol];
  });

  return props;
}

function set (elem, props) {
  assign(elem, props);
}

export default function (...args) {
  const [ elem, props ] = args;
  return args.length === 1 ? get(elem) : set(elem, props);
}
