import create from './api/create';
import emit from './api/emit';
import factory from './api/factory';
import fragment from './api/fragment';
import init from './api/init';
import properties from './api/properties/index';
import ready from './api/ready';
import render from './api/render';
import skate from './api/skate';
import version from './api/version';

skate.create = create;
skate.emit = emit;
skate.factory = factory;
skate.fragment = fragment;
skate.init = init;
skate.properties = properties;
skate.ready = ready;
skate.render = render;
skate.version = version;

export default skate;
export {
  create,
  emit,
  factory,
  fragment,
  init,
  properties,
  ready,
  render,
  version
};
