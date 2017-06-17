/* eslint-env jest */

import { define } from '../../src';

const { customElements, HTMLElement } = window;

describe('api/define', () => {
  describe('`static is`', () => {
    it('should be used as the element name', () => {
      const name = 'x-test-unique';
      const Elem = define(class extends HTMLElement {
        static is = name
      });
      expect(Elem.is).toEqual(name);
      expect(customElements.get(Elem.is)).toEqual(Elem);
    });
  });
});
