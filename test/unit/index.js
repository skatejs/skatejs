/* eslint-env jasmine, mocha */

import * as api from '../../src/index';

describe('exports', () => {
  it('skate', () => {
    expect(api).to.be.an('object');
  });

  it('skate.Component', () => {
    expect(api.Component).to.be.a('function');
  });

  it('skate.define', () => {
    expect(api.define).to.be.a('function');
  });

  it('skate.emit', () => {
    expect(api.emit).to.be.a('function');
  });

  it('skate.link', () => {
    expect(api.link).to.be.a('function');
  });

  it('skate.prop', () => {
    expect(api.prop).to.be.an('object');
    expect(api.prop.array).to.be.an('object', 'array');
    expect(api.prop.boolean).to.be.an('object', 'boolean');
    expect(api.prop.number).to.be.an('object', 'number');
    expect(api.prop.object).to.be.an('object', 'object');
    expect(api.prop.string).to.be.an('object', 'string');
  });

  it('skate.props', () => {
    expect(api.props).to.be.a('function');
  });

  it('skate.h', () => {
    expect(api.h).to.be.a('function');
  });

  it('skate.vdom', () => {
    expect(api.vdom).to.be.an('object');
  });
});
