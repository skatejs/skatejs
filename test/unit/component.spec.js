/* eslint-env mocha */

import { Component } from 'src';
import root from 'src/util/root';
import expect from 'expect';

const { HTMLElement } = root;

describe('api/Component', () => {
  it('should extend an HTMLElement by default', () => {
    expect(class extends Component {}.prototype instanceof HTMLElement).toBe(true);
  });
});
