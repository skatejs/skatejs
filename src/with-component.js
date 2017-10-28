// @flow

import type { WithComponent } from './types';

import { withChildren } from './with-children';
import { withContext } from './with-context';
import { withLifecycle } from './with-lifecycle';
import { withUpdate } from './with-update';
import { withRenderer } from './with-renderer';
import { withUnique } from './with-unique';

export const withComponent = (Base?: Class<any>): Class<WithComponent> =>
  withLifecycle(
    withChildren(
      withContext(withUpdate(withRenderer(withUnique(Base || HTMLElement))))
    )
  );
