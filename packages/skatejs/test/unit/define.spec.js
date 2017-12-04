/* eslint-env jest */

import { define, name } from '../../src';

describe('api/define', () => {
  describe('`static is`', () => {
    it('should be used as the element name', () => {
      const Elem = define(
        class extends HTMLElement {
          static is = name();
        }
      );
      expect(Elem.is).toBeDefined();
      expect(customElements.get(Elem.is)).toEqual(Elem);
    });
  });
});
