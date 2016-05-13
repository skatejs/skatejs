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

  it('skate.properties', function () {
    expect(skate.properties.array).to.be.a('function', 'array');
    expect(skate.properties.boolean).to.be.a('function', 'boolean');
    expect(skate.properties.number).to.be.a('function', 'number');
    expect(skate.properties.string).to.be.a('function', 'string');

    expect(api.properties.array).to.equal(skate.properties.array);
    expect(api.properties.boolean).to.equal(skate.properties.boolean);
    expect(api.properties.number).to.equal(skate.properties.number);
    expect(api.properties.string).to.equal(skate.properties.string);
  });

  it('skate.ready', function () {
    expect(skate.ready).to.be.a('function');
    expect(api.ready).to.equal(skate.ready);
  });

  it('skate.render', function () {
    expect(skate.render).to.be.a('function');
    expect(api.render).to.equal(skate.render);
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
