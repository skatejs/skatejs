// Type definitions for skatejs@5.0.0-beta.3
// Project: https://github.com/skatejs/skatejs
// TypeScript Version: 2.5

// UMD library
export as namespace skate;

// Public API: mixins
export {
  withComponent,
  withLifecycle,
  withContext,
  withChildren,
  withUpdate,
  withRenderer,
  withUnique
} from './ts-types/api';

// Public API: utils
export { prop, props, link, define, emit, shadow } from './ts-types/api';

// Public types ( Unfortunately TS doesn't have Opaque Types like Flow )
export {
  Constructor,
  CustomElement,
  ComponentProps,
  PropOptions,
  Renderer,
  WithComponent,
  WithLifecycle,
  WithContext,
  WithChildren,
  WithUpdate,
  WithRenderer,
  WithUnique
} from './ts-types/types';
