import create from './api/create';
import emit from './api/emit';
import factory from './api/factory';
import fragment from './api/fragment';
import init from './api/init';
import link from './api/link';
import properties from './api/properties/index';
import ready from './api/ready';
import render from './api/render';
import skate from './api/skate';
import state from './api/state';
import vdom from './api/vdom';
import version from './api/version';

skate.create = create;
skate.emit = emit;
skate.factory = factory;
skate.fragment = fragment;
skate.init = init;
skate.link = link;
skate.properties = properties;
skate.ready = ready;
skate.render = render;
skate.state = state;
skate.vdom = vdom;
skate.version = version;

export default skate;
export {
  create,
  emit,
  factory,
  fragment,
  init,
  link,
  properties,
  ready,
  render,
  state,
  vdom,
  version
};
