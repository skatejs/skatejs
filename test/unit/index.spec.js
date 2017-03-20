/* eslint-env mocha */

import * as api from 'src';
import expect from 'expect';

describe('exports', () => {
  it('skate', () => {
    expect(api).toBeAn('object');
  });

  it('skate.Component', () => {
    expect(api.Component).toBeA('function');
  });

  it('skate.define', () => {
    expect(api.define).toBeA('function');
  });

  it('skate.emit', () => {
    expect(api.emit).toBeA('function');
  });

  it('skate.link', () => {
    expect(api.link).toBeA('function');
  });

  it('skate.with*', () => {
    expect(api.withComponent).toBeA('function', 'withComponent');
    expect(api.withProps).toBeA('function', 'withProps');
    expect(api.withRaw).toBeA('function', 'withRaw');
    expect(api.withRender).toBeA('function', 'withRender');
  });

  it('skate.props.*', () => {
    expect(api.props.array).toBeAn('object', 'array');
    expect(api.props.boolean).toBeAn('object', 'boolean');
    expect(api.props.number).toBeAn('object', 'number');
    expect(api.props.object).toBeAn('object', 'object');
    expect(api.props.string).toBeAn('object', 'string');
  });

  it('skate.h', () => {
    expect(api.h).toBeA('function');
  });
});
