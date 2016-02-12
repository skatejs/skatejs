import assign from 'object-assign';
import createElement from '../native/create-element';
import init from './init';
import registry from '../shared/registry';

export default function (name, props) {
  const Ctor = registry.get(name);
  const elem = Ctor ? Ctor.type.create(Ctor) : createElement(name);
  Ctor && init(elem);
  return assign(elem, props);
}
