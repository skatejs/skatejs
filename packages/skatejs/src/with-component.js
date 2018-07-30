// @flow

import { withChildren } from './with-children.js';
import { withLifecycle } from './with-lifecycle.js';
import { withUpdate } from './with-update.js';
import { withRenderer } from './with-renderer.js';

export const withComponent = (Base: Class<any> = HTMLElement): Class<any> =>
  withLifecycle(withChildren(withUpdate(withRenderer(Base))));
