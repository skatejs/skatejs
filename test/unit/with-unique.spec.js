/* eslint-env mocha */

import expect from 'expect';

import { withUnique } from 'src';

describe('withUnique', () => {
  describe('static is', () => {
    it('should auto-generate a name for an anonymous class', () => {
      expect(class extends withUnique() {}.is).toMatch(/^x-[a-z]+/);
    });

    it('should auto-generate a name from the class name', () => {
      class Element extends withUnique() {}
      class MyElement extends withUnique() {}
      expect(Element.is).toMatch(/^x-element/);
      expect(MyElement.is).toMatch(/^my-element/);
    });

    it('should return the same name when called multiple times', () => {
      class E extends withUnique() {}
      expect(E.is).toBe(E.is);
    });

    it('name should not be the same for multiple classes', () => {
      const E1 = class extends withUnique() {};
      const E2 = class extends withUnique() {};
      expect(E1.is).toNotBe(E2.is);
    });
  });
});
