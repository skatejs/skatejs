/* eslint-env mocha */

import expect from 'expect';

import { withUnique } from 'src';

describe('withUnique', () => {
  describe('static is', () => {
    it('should auto-generate a name for an anonymous class', () => {
      expect(class extends withUnique() {}.is).toMatch(/^x-/);
    });

    it('should auto-prefix the name with an "x-" if no dash is detected', () => {
      expect(class extends withUnique() { static is = 'test' }.is).toMatch(/^x-test/);
    });

    it('should return an auto-generated name from the class name', () => {
      class MyElement extends withUnique() {}
      expect(MyElement.is).toMatch(/^my-element/);
    });

    it('should return the same name when called multiple times', () => {
      const E1 = class extends withUnique() {};
      const E2 = class extends withUnique() {};
      expect(E1.is).toBe(E1.is);
      expect(E2.is).toBe(E2.is);
    });

    it('name should not be the same for multiple classes', () => {
      const E1 = class extends withUnique() {};
      const E2 = class extends withUnique() {};
      expect(E1.is).toNotBe(E2.is);
    });

    it('should generate a name when there is a conflict', () => {
      const E1 = class extends withUnique() {
        static is = 'x-test';
      };
      const E2 = class extends withUnique() {
        static is = 'x-test';
      };
      expect(E1.is).toNotBe(E2.is);
    });
  });

  it('should auto-define a custom element when constructed', () => {
    const E = class extends withUnique() {};
    expect(() => new E()).toNotThrow();
    const e = new E();
    expect(e.localName).toBe(E.is);
  });
});
