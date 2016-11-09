/* eslint-env jasmine, mocha */

import { Component, define } from '../../src/index';
import resolved from '../lib/resolved';
import uniqueId from '../../src/util/unique-id';

describe('constructor', () => {
  let id;

  beforeEach(() => {
    id = uniqueId();
  });

  it('custom elements', () => {
    const Ctor = define(id, class extends Component {});
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal(id);
  });
});
