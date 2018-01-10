import { withChildren } from './with-children.js';
import { withContext } from './with-context.js';
import { withLifecycle } from './with-lifecycle.js';
import { withUpdate } from './with-update.js';
import { withRenderer } from './with-renderer.js';

export const withComponent = (Base = HTMLElement) =>
  withLifecycle(
    withChildren(withContext(withUpdate(withRenderer(Base || HTMLElement))))
  );
