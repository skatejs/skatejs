/* eslint-env jasmine, mocha */

import { Mixins } from '../../../src';
import root from '../../../src/util/root';

const { HTMLElement } = root;

describe('api/Mixins', () => {
  describe('Component', () => {
    it('should extend custom classes', () => {
      class Base extends HTMLElement {}
      expect(class extends Mixins.Component(Base) {}.prototype).to.be.an.instanceOf(Base);
    });
  });
});
