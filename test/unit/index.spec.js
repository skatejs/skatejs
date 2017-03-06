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

  it('skate.Mixins', () => {
    expect(api.Mixins).toBeAn('object');
    expect(api.Mixins.Component).toBeA('function', 'Component');
    expect(api.Mixins.Props).toBeA('function', 'Props');
    expect(api.Mixins.Raw).toBeA('function', 'Raw');
    expect(api.Mixins.Render).toBeA('function', 'Render');
  });

  it('skate.prop', () => {
    expect(api.prop).toBeAn('object');
    expect(api.prop.array).toBeAn('object', 'array');
    expect(api.prop.boolean).toBeAn('object', 'boolean');
    expect(api.prop.number).toBeAn('object', 'number');
    expect(api.prop.object).toBeAn('object', 'object');
    expect(api.prop.string).toBeAn('object', 'string');
  });

  it('skate.props', () => {
    expect(api.props).toBeA('function');
  });

  it('skate.h', () => {
    expect(api.h).toBeA('function');
  });
});
