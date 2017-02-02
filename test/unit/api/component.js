/* eslint-env jasmine, mocha */

import { Element } from '../../../src';
import root from '../../../src/util/root';

const { HTMLElement } = root;

describe('api/Component', () => {
  it('should extend an HTMLElement by default', () => {
    expect(class extends Element() {}.prototype).to.be.an.instanceOf(HTMLElement);
  });

  it('should extend custom classes', () => {
    class Base extends HTMLElement {}
    expect(class extends Element(Base) {}.prototype).to.be.an.instanceOf(Base);
  });
});
