import assign from '../../util/assign';
import propsInit from '../../lifecycle/props-init';
import propsBoolean from './boolean';
import propsFloat from './float';
import propsNumber from './number';
import propsString from './string';

function prop (type) {
  return function (opts) {
    return propsInit(assign({
      attribute: true
    }, type, opts));
  };
}

export default {
  boolean: prop(propsBoolean),
  float: prop(propsFloat),
  number: prop(propsNumber),
  string: prop(propsString)
};
