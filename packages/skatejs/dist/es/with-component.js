import { withChildren } from './with-children.js';
import { withContext } from './with-context.js';
import { withLifecycle } from './with-lifecycle.js';
import { withUpdate } from './with-update.js';
import { withRenderer } from './with-renderer.js';

export var withComponent = function withComponent() {
  var Base =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : HTMLElement;
  return withLifecycle(
    withChildren(withContext(withUpdate(withRenderer(Base || HTMLElement))))
  );
};
