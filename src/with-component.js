// @flow

import type { WithComponent } from './types';

import { withChildren } from './with-children';
import { withContext } from './with-context';
import { withLifecycle } from './with-lifecycle';
import { withProps } from './with-props';
import { withRenderer } from './with-renderer';
import { withState } from './with-state';
import { withUnique } from './with-unique';

export const withComponent = (Base?: Class<any>): Class<WithComponent> =>
  withLifecycle(
    withChildren(
      withContext(
        withProps(withRenderer(withState(withUnique(Base || HTMLElement))))
      )
    )
  );
