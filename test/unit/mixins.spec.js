/* eslint-env mocha */

import { h as preactH } from 'preact';
import { h, Mixins } from 'src';
import root from 'src/util/root';
import expect from 'expect';

const { HTMLElement } = root;

describe('api/Mixins', () => {
  it('should directly export h from preact', () => {
    expect(h).toEqual(preactH);
  });

  describe('Component', () => {
    it('should extend custom classes', () => {
      class Base extends HTMLElement {}
      expect(class extends Mixins.Component(Base) {}.prototype instanceof Base).toBe(true);
    });
  });
});
