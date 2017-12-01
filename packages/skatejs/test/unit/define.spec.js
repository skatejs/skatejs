/* eslint-env jest */

import { define, withUnique } from '../../src';

const { customElements, HTMLElement } = window;

describe('api/define', () => {
  describe('`static is`', () => {
    it('should be used as the element name', () => {
      const Elem = define(class extends withUnique() {});
      expect(Elem.is).toBeDefined();
      expect(customElements.get(Elem.is)).toEqual(Elem);
    });
  });
});
