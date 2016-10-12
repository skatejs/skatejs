/* eslint-env jasmine, mocha */

import { define } from '../../src/index';
import helperElement from '../lib/element';
import resolved from '../lib/resolved';

describe('constructor', () => {
  let id;

  beforeEach(() => {
    id = helperElement().safe;
  });

  it('custom elements', () => {
    const Ctor = define(id, {});
    const ctor = new Ctor();
    expect(resolved(ctor)).to.equal(true);
    expect(ctor.tagName.toLowerCase()).to.equal(id);
  });
});
