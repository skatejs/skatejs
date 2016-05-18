import skate, * as api from '../../src/index';

describe('exports', function () {
  it('skate', function () {
    expect(skate).to.be.a('function');
    expect(api).to.be.an('object');
  });

  it('skate.create', function () {
    expect(skate.create).to.be.a('function');
    expect(api.create).to.equal(skate.create);
  });

  it('skate.emit', function () {
    expect(skate.emit).to.be.a('function');
    expect(api.emit).to.equal(skate.emit);
  });

  it('skate.factory', function () {
    expect(skate.factory).to.be.a('function');
    expect(api.factory).to.equal(skate.factory);
  });

  it('skate.fragment', function () {
    expect(skate.fragment).to.be.a('function');
    expect(api.fragment).to.equal(skate.fragment);
  });

  it('skate.init', function () {
    expect(skate.init).to.be.a('function');
    expect(api.init).to.equal(skate.init);
  });

  it('skate.link', function () {
    expect(skate.link).to.be.a('function');
    expect(api.link).to.equal(skate.link);
  });

  it('skate.prop', function () {
    expect(skate.prop.array).to.be.a('function', 'array');
    expect(skate.prop.boolean).to.be.a('function', 'boolean');
    expect(skate.prop.number).to.be.a('function', 'number');
    expect(skate.prop.string).to.be.a('function', 'string');

    expect(api.prop.array).to.equal(skate.prop.array);
    expect(api.prop.boolean).to.equal(skate.prop.boolean);
    expect(api.prop.number).to.equal(skate.prop.number);
    expect(api.prop.string).to.equal(skate.prop.string);
  });

  it('skate.ready', function () {
    expect(skate.ready).to.be.a('function');
    expect(api.ready).to.equal(skate.ready);
  });

  it('skate.state', function () {
    expect(skate.state).to.be.a('function');
    expect(api.state).to.equal(skate.state);
  });

  it('vdom', function () {
    expect(skate.vdom).to.be.a('function');
    expect(api.vdom).to.equal(skate.vdom);
  });

  it('skate.version', function () {
    expect(skate.version).to.be.a('string');
    expect(api.version).to.equal(skate.version);
  });
});
