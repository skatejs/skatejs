/* eslint-env jasmine, mocha */

import { Component } from '../../../src';
import root from '../../../src/util/root';

const { HTMLElement } = root;

describe('api/Component', () => {
  it('should extend an HTMLElement by default', () => {
    expect(class extends Component {}.prototype).to.be.an.instanceOf(HTMLElement);
  });
});
