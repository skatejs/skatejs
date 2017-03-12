/* eslint-env mocha */

import { Mixins } from 'src';
import root from 'src/util/root';
import expect from 'expect';

const { HTMLElement } = root;

describe('Mixins.Component', () => {
  it('should extend custom classes', () => {
    class Base extends HTMLElement {}
    expect(class extends Mixins.Component(Base) {}.prototype instanceof Base).toBe(true);
  });
});
