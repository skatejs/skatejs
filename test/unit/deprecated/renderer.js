/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src';

describe('deprecated/lifecycle/renderer', () => {
  it('default', () => {
    expect(define(class extends Component {}).renderer).to.be.a('function');
  });

  it('override', () => {
    function renderer () {}
    expect(define(class extends Component { static renderer = renderer }).renderer).to.equal(renderer);
  });
});
