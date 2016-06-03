import skate, * as api from '../../src/index';
import umd from '../../dist/index';

describe('exports', function () {
  it('skate', function () {
    expect(skate).to.be.a('function');
    expect(api).to.be.an('object');
    expect(umd).to.be.an('object');
  });

  it('skate.create', function () {
    expect(api.create).to.be.a('function');
    expect(umd.create).to.be.a('function');
  });

  it('skate.define', function () {
    expect(api.define).to.be.a('function');
    expect(umd.define).to.be.a('function');
  });

  it('skate.emit', function () {
    expect(api.emit).to.be.a('function');
    expect(umd.emit).to.be.a('function');
  });

  it('skate.factory', function () {
    expect(api.factory).to.be.a('function');
    expect(umd.factory).to.be.a('function');
  });

  it('skate.link', function () {
    expect(api.link).to.be.a('function');
    expect(umd.link).to.be.a('function');
  });

  it('skate.prop', function () {
    expect(api.prop).to.be.an('function');
    expect(api.prop.array).to.be.a('function', 'api array');
    expect(api.prop.boolean).to.be.a('function', 'api boolean');
    expect(api.prop.number).to.be.a('function', 'api number');
    expect(api.prop.string).to.be.a('function', 'api string');
    expect(umd.prop).to.be.an('function');
    expect(umd.prop.array).to.be.a('function', 'umd array');
    expect(umd.prop.boolean).to.be.a('function', 'umd boolean');
    expect(umd.prop.number).to.be.a('function', 'umd number');
    expect(umd.prop.string).to.be.a('function', 'umd string');
  });

  it('skate.ready', function () {
    expect(api.ready).to.be.a('function');
    expect(umd.ready).to.be.a('function');
  });

  it('skate.symbols', function () {
    expect(api.symbols).to.be.an('object');
    expect(api.symbols.shadowRoot).to.be.a('string');
    expect(umd.symbols).to.be.an('object');
    expect(umd.symbols.shadowRoot).to.be.a('string');
  });

  it('skate.state', function () {
    expect(api.state).to.be.a('function');
    expect(umd.state).to.be.a('function');
  });

  it('vdom', function () {
    expect(api.vdom).to.be.a('function');
    expect(umd.vdom).to.be.a('function');
  });

  it('skate.version', function () {
    expect(api.version).to.be.a('string');
    expect(umd.version).to.be.a('string');
  });
});
