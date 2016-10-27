/* eslint-env jasmine, mocha */

import { define } from '../../../src';

describe('lifecycle/render', () => {
  it('default', () => {
    expect(define('x-test', {}).renderer).to.be.a('function');
  });

  it('override', () => {
    function renderer () {}
    expect(define('x-test', { renderer }).renderer).to.equal(renderer);
  });
});
