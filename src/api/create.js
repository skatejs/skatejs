import assign from 'object-assign';
import init from './init';
import registry from '../shared/registry';

export default function (name, props) {
  const Ctor = registry.get(name);
  const elem = Ctor ? Ctor.type.create(Ctor) : document.createElement(name);
  Ctor && Ctor.isNative || init(elem);
  return assign(elem, props);
}
