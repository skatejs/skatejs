import * as api from '../../src/index';
import * as symbols from '../../src/util/symbols';

describe('exports', function () {
  it('skate', function () {
    expect(api).to.be.an('object');
  });

  it('skate.Component', function () {
    expect(api.Component).to.be.a('function');
  });

  it('skate.define', function () {
    expect(api.define).to.be.a('function');
  });

  it('skate.emit', function () {
    expect(api.emit).to.be.a('function');
  });

  it('skate.link', function () {
    expect(api.link).to.be.a('function');
  });

  it('skate.prop', function () {
    expect(api.prop).to.be.an('object');
    expect(api.prop.array).to.be.a('function', 'array');
    expect(api.prop.boolean).to.be.a('function', 'boolean');
    expect(api.prop.create).to.be.an('function', 'create');
    expect(api.prop.number).to.be.a('function', 'number');
    expect(api.prop.string).to.be.a('function', 'string');
  });

  it('skate.ready', function () {
    expect(api.ready).to.be.a('function');
  });

  it('skate.symbols', function () {
    expect(api.symbols).to.be.an('object');
    expect(api.symbols.name).to.equal(symbols.name);
    expect(api.symbols.shadowRoot).to.equal(symbols.shadowRoot);
  });

  it('skate.state', function () {
    expect(api.state).to.be.a('function');
  });

  it('vdom', function () {
    expect(api.vdom).to.be.an('object');
  });
});
