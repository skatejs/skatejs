// @flow
// @jsx h

import { h } from '@skatejs/val';
import { shadow } from '..';

test('should be a function', () => {
  expect(typeof shadow).toBe('function');
});

test('should create the shadow root', () => {
  const el = <div />;
  shadow(el);
  expect(el.shadowRoot instanceof Node).toBe(true);
});

test('should return the shadow root', () => {
  expect(shadow(<div />) instanceof Node).toBe(true);
});
