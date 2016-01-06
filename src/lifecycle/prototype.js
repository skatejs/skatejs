import protos from '../util/protos';
import utilDefineProperties from '../util/define-properties';
import utilGetOwnPropertyDescriptors from '../util/get-own-property-descriptors';

export default function prototype (opts) {
  let prototypes = protos(opts.prototype);
  return function (elem) {
    prototypes.forEach(function (proto) {
      if (!proto.isPrototypeOf(elem)) {
        utilDefineProperties(elem, utilGetOwnPropertyDescriptors(proto));
      }
    });
  };
}
