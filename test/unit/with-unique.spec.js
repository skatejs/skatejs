/* eslint-env mocha */

import expect from 'expect';

import { withUnique } from 'src';

describe('withUnique', () => {
  describe('static is', () => {
    it('should return a custom element tag name', () => {
      const E = class extends withUnique() {};
      expect(E.is).toMatch(/^x-[a-z0-9]{8}/);
    });

    it('should be same when called multiple times for the same class', () => {
      const E = class extends withUnique() {};
      expect(E.is).toBe(E.is);
    });

    it('should be different when called multiple times for a different class', () => {
      const E1 = class extends withUnique() {};
      const E2 = class extends withUnique() {};
      expect(E1.is).toNotBe(E2.is);
    });
  });
});
