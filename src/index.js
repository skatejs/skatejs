import assign from 'object-assign';

// Public API
import define from './api/define';
import emit from './api/emit';
import factory from './api/factory';
import link from './api/link';
import prop, * as props from './api/prop';
import ready from './api/ready';
import state from './api/state';
import * as symbols from './api/symbols';
import vdom, * as vdomElements from './api/vdom';
import version from './api/version';

assign(prop, props);
assign(vdom, vdomElements);

export default define;
export {
  define,
  emit,
  factory,
  link,
  prop,
  ready,
  state,
  symbols,
  vdom,
  version
};
