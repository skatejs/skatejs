// @flow

/** @jsx h */
/* eslint-env jest */

import { h } from '@skatejs/val';
import { shadow } from '../../src';

test('should be a function', () => {
  expect(typeof shadow).toBe('function');
});

test.only('should create the shadow root', () => {
  const el = <div />;
  shadow(el);
  expect(el.shadowRoot instanceof Node).toBe(true);
});

test('should return the shadow root', () => {
  expect(shadow(<div />) instanceof Node).toBe(true);
});

test('should pass options to attachShadow', () => {
  const el = <div />;
  const sr = shadow(el, { mode: 'closed' });
  expect(sr instanceof Node).toBe(true);
  expect(!!el.shadowRoot).toBe(false);
});
