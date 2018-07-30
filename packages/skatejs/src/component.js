// @flow

import { withComponent } from './with-component.js';

// This is so the transform can patch this class and everything extending it
// doesn't need to worry about a shim for native / polyfilled custom elements.
class PatchedHTMLElement extends HTMLElement {}

// This is merely convenience that enables:
//
// - Not having to patch HTMLElement (shim or transform).
// - Doing: withComponent(HTMLElement).
export const Component = withComponent(PatchedHTMLElement);
