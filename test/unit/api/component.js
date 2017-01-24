/* eslint-env jasmine, mocha */

import { Element } from '../../../src';
import root from '../../../src/util/root';

const { HTMLDivElement, HTMLElement } = root;

describe('api/Element', () => {
  it('should extend an HTMLElement by default', () => {
    expect(class extends Element() {}.prototype).to.be.an.instanceOf(HTMLElement);
  });

  it('should extend any built-in', () => {
    expect(class extends Element(HTMLDivElement) {}.prototype).to.be.an.instanceof(HTMLDivElement);
  });
});
