/* @flow */

import { withComponent } from '..';

const { expect, test } = global;

test('should extend custom classes', () => {
  class Base extends HTMLElement {}
  expect(class extends withComponent(Base) {}.prototype instanceof Base).toBe(
    true
  );
});
