/* eslint-env jest */

import * as api from '../../src';

describe('exports', () => {
  it('skate', () => {
    expect(typeof api).toBe('object');
  });

  it('skate.define', () => {
    expect(typeof api.define).toBe('function');
  });

  it('skate.emit', () => {
    expect(typeof api.emit).toBe('function');
  });

  it('skate.link', () => {
    expect(typeof api.link).toBe('function');
  });

  it('skate.with*', () => {
    expect(typeof api.withChildren).toBe('function', 'withChildren');
    expect(typeof api.withComponent).toBe('function', 'withComponent');
    expect(typeof api.withProps).toBe('function', 'withProps');
    expect(typeof api.withRenderer).toBe('function', 'withRenderer');
    expect(typeof api.withUnique).toBe('function', 'withUnique');
  });

  it('skate.props.*', () => {
    expect(typeof api.props.array).toBe('function', 'array');
    expect(typeof api.props.boolean).toBe('function', 'boolean');
    expect(typeof api.props.number).toBe('function', 'number');
    expect(typeof api.props.object).toBe('function', 'object');
    expect(typeof api.props.string).toBe('function', 'string');
  });
});
