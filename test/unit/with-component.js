/* eslint-env jest */

import { withComponent } from '../../src';

describe('withComponent', () => {
  it('should extend custom classes', () => {
    class Base extends HTMLElement {}
    expect(class extends withComponent(Base) {}.prototype instanceof Base).toBe(true);
  });
});
