import assign from 'object-assign';

// Public API
import create from './api/create';
import emit from './api/emit';
import factory from './api/factory';
import fragment from './api/fragment';
import init from './api/init';
import link from './api/link';
import prop, * as properties from './api/prop';
import ready from './api/ready';
import skate from './api/skate';
import state from './api/state';
import vdom, * as vdomElements from './api/vdom';
import version from './api/version';

assign(prop, properties);
assign(vdom, vdomElements);

export default skate;
export {
  create,
  emit,
  factory,
  fragment,
  init,
  link,
  prop,
  ready,
  skate,
  state,
  vdom,
  version
};
