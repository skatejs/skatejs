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

  it('skate.prop*', () => {
    expect(api.propArray).toBeAn('object', 'array');
    expect(api.propBoolean).toBeAn('object', 'boolean');
    expect(api.propNumber).toBeAn('object', 'number');
    expect(api.propObject).toBeAn('object', 'object');
    expect(api.propString).toBeAn('object', 'string');
  });

  it('skate.*Props', () => {
    expect(api.getProps).toBeA('function');
    expect(api.setProps).toBeA('function');
  });

  it('skate.h', () => {
    expect(api.h).toBeA('function');
  });
});
