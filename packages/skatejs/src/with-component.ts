import { CustomElementConstructor } from './types';
import { withChildren } from './with-children';
import { withUpdate } from './with-update';
import { withRenderer } from './with-renderer';

export const withComponent = (Base: CustomElementConstructor): CustomElementConstructor =>
  withChildren(withUpdate(withRenderer(Base)));
