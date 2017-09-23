// @flow

import { withChildren } from './with-children';
import { withProps } from './with-props';
import { withRenderer } from './with-renderer';
import { withUnique } from './with-unique';

export const withComponent = (Base?: Class<any>) =>
  withChildren(withProps(withRenderer(withUnique(Base || HTMLElement))));
