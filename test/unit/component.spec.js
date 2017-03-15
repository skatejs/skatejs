/* eslint-env mocha */

import expect from 'expect';

import { Component } from 'src';
import { root } from 'src/util';

const { HTMLElement } = root;

describe('api/Component', () => {
  it('should extend an HTMLElement by default', () => {
    expect(class extends Component {}.prototype instanceof HTMLElement).toBe(true);
  });
});
