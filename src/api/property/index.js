import assign from '../../util/assign';
import property from '../../lifecycle/property';
import propertyBoolean from './boolean';
import propertyFloat from './float';
import propertyNumber from './number';
import propertyString from './string';

function prop (type) {
  return function (opts) {
    return property(assign({
      attribute: true
    }, type, opts));
  };
}

export default {
  boolean: prop(propertyBoolean),
  float: prop(propertyFloat),
  number: prop(propertyNumber),
  string: prop(propertyString)
};
