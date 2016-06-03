import getOwnPropertyDescriptors from './get-own-property-descriptors';
import protos from './protos';

export default function (obj) {
  return protos(obj|| {}).reduce(function (result, proto) {
    const descriptors = getOwnPropertyDescriptors(proto);
    Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
      result[name] = descriptors[name];
      return result;
    }, result);
    return result;
  }, {});
}
