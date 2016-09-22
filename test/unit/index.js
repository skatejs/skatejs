import * as api from '../../src/index';
import * as symbols from '../../src/util/symbols';

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
    expect(api.prop.array).to.be.a('function', 'array');
    expect(api.prop.boolean).to.be.a('function', 'boolean');
    expect(api.prop.create).to.be.an('function', 'create');
    expect(api.prop.number).to.be.a('function', 'number');
    expect(api.prop.string).to.be.a('function', 'string');
  });

  it('skate.props', () => {
    expect(api.props).to.be.a('function');
  });

  it('skate.ready', () => {
    expect(api.ready).to.be.a('function');
  });

  it('skate.symbols', () => {
    expect(api.symbols).to.be.an('object');
    expect(api.symbols.name).to.equal(symbols.name);
    expect(api.symbols.shadowRoot).to.equal(symbols.shadowRoot);
  });

  it('skate.h', () => {
    expect(api.h).to.be.a('function');
  });

  it('skate.vdom', () => {
    expect(api.vdom).to.be.an('object');
  });
});
