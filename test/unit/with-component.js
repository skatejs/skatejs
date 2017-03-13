/* eslint-env mocha */

import expect from 'expect';

import { withComponent } from 'src';
import root from 'src/util/root';

const { HTMLElement } = root;

describe('withComponent', () => {
  it('should extend custom classes', () => {
    class Base extends HTMLElement {}
    expect(class extends withComponent(Base) {}.prototype instanceof Base).toBe(true);
  });
});
