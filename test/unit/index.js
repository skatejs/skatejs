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

  it('skate.Mixins', () => {
    expect(api.Mixins).to.be.an('object');
    expect(api.Mixins.Base).to.be.a('function', 'Base');
    expect(api.Mixins.Component).to.be.a('function', 'Component');
    expect(api.Mixins.Props).to.be.a('function', 'Props');
    expect(api.Mixins.Render).to.be.a('function', 'Render');
  });

  it('skate.prop', () => {
    expect(api.prop).to.be.an('object');
    expect(api.prop.array).to.be.a('function', 'array');
    expect(api.prop.boolean).to.be.a('function', 'boolean');
    expect(api.prop.create).to.be.an('function', 'create');
    expect(api.prop.number).to.be.a('function', 'number');
    expect(api.prop.string).to.be.a('function', 'string');
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
