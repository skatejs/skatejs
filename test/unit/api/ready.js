/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src/index';
import fixture from '../../lib/fixture';
import ready from '../../../src/api/ready';
import uniqueId from '../../../src/util/unique-id';

describe('api/ready', () => {
  let elem;
  let tag;

  function setup () {
    define(tag, class extends Component {});
  }

  beforeEach(() => {
    tag = uniqueId();
    elem = fixture().appendChild(document.createElement(tag));
  });

  it('should fire for an element when it is already ready', (done) => {
    setup();
    ready(elem, (shouldBeElem) => {
      expect(shouldBeElem).to.equal(elem);
      done();
    });
  });

  it('should fire for an element when it is eventually ready', (done) => {
    ready(elem, (shouldBeElem) => {
      expect(shouldBeElem).to.equal(elem);
      done();
    });
    setup();
  });
});
