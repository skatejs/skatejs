// @flow

import { withChildren } from './with-children';
import { withProps } from './with-props';
import { withRenderer } from './with-renderer';
import { withState } from './with-state';
import { withUnique } from './with-unique';

export const withComponent = (Base?: Class<HTMLElement>) =>
  withChildren(
    withProps(withRenderer(withState(withUnique(Base || HTMLElement))))
  );
