/* eslint-env jest */

import { Component } from '../../src';

describe('api/Component', () => {
  it('should extend an HTMLElement by default', () => {
    expect(class extends Component {}.prototype instanceof HTMLElement).toBe(true);
  });
});
